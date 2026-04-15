const Profile = require('../models/Profile');
const { consultAllOracles, classifyAgeGroup } = require('../utils/fn');


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

    // if there is already a profile with the same name, return it
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

    // if there is no profile with the same name, create a new one
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




const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const profile = await Profile.findById(id);
    
    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        id: profile._id,
        name: profile.name,
        gender: profile.gender,
        gender_probability: profile.gender_probability,
        sample_size: profile.sample_size,
        age: profile.age,
        age_group: profile.age_group,
        country_id: profile.country_id,
        country_probability: profile.country_probability,
        created_at: profile.created_at.toISOString()
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


const getAllProfiles = async (req, res) => {
  try {
    const { gender, country_id, age_group } = req.query;
    
    const filter = {};
    
    if (gender) {
      filter.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
    }
    
    if (country_id) {
      filter.country_id = { $regex: new RegExp(`^${country_id}$`, 'i') };
    }
    
    if (age_group) {
      filter.age_group = { $regex: new RegExp(`^${age_group}$`, 'i') };
    }
    
    const profiles = await Profile.find(filter).sort({ created_at: -1 });
    
    const formattedProfiles = profiles.map(profile => ({
      id: profile._id,
      name: profile.name,
      gender: profile.gender,
      age: profile.age,
      age_group: profile.age_group,
      country_id: profile.country_id,
      created_at: profile.created_at.toISOString()
    }));
    
    res.status(200).json({
      status: 'success',
      count: formattedProfiles.length,
      data: formattedProfiles
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};


const deleteProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const profile = await Profile.findById(id);
    
    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found'
      });
    }
    
    await Profile.findByIdAndDelete(id);

    res.status(204).send();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createProfile,
  getProfileById,
  getAllProfiles,
  deleteProfileById
};