const Profile = require('../models/Profile');
const { consultAllOracles } = require('../oracles');
const { classifyAgeGroup } = require('../utils');

const createProfile = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Name cannot be empty'
      });
    }
    
    const trimmedName = name.trim();
    
    const existingProfile = await Profile.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } 
    });
    
    if (existingProfile) {
      return res.status(201).json({
        status: 'success',
        message: 'Profile already exists',
        data: {
          id: existingProfile._id,
          name: existingProfile.name,
          gender: existingProfile.gender,
          gender_probability: existingProfile.gender_probability,
          sample_size: existingProfile.sample_size,
          age: existingProfile.age,
          age_group: existingProfile.age_group,
          country_id: existingProfile.country_id,
          country_probability: existingProfile.country_probability,
          created_at: existingProfile.created_at.toISOString()
        }
      });
    }
    
    let oracleData;
    try {
      oracleData = await consultAllOracles(trimmedName);
    } catch (error) {
      const apiName = error.message.split(' ')[0];
      return res.status(502).json({
        status: 'error',
        message: `${apiName} returned an invalid response`
      });
    }
    
    const ageGroup = classifyAgeGroup(oracleData.age);
    
    const newProfile = await Profile.create({
      name: trimmedName,
      gender: oracleData.gender,
      gender_probability: oracleData.gender_probability,
      sample_size: oracleData.sample_size,
      age: oracleData.age,
      age_group: ageGroup,
      country_id: oracleData.country_id,
      country_probability: oracleData.country_probability
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        id: newProfile._id,
        name: newProfile.name,
        gender: newProfile.gender,
        gender_probability: newProfile.gender_probability,
        sample_size: newProfile.sample_size,
        age: newProfile.age,
        age_group: newProfile.age_group,
        country_id: newProfile.country_id,
        country_probability: newProfile.country_probability,
        created_at: newProfile.created_at.toISOString()
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createProfile
};