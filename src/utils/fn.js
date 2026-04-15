const axios = require('axios');


function classifyAgeGroup(age) {
  if (age <= 12) return 'child';
  if (age <= 19) return 'teenager';
  if (age <= 59) return 'adult';
  return 'senior';
}



async function consultGenderize(name) {
  const response = await axios.get(`https://api.genderize.io`, {
    params: { name }
  });
  
  const data = response.data;
  
  if (!data.gender || data.count === 0) {
    throw new Error('Genderize returned an invalid response');
  }
  
  return data;
}



async function consultAgify(name) {
  const response = await axios.get(`https://api.agify.io`, {
    params: { name }
  });
  
  const data = response.data;
  
  if (data.age === null || data.age === undefined) {
    throw new Error('Agify returned an invalid response');
  }
  
  return data;
}


async function consultNationalize(name) {
  const response = await axios.get(`https://api.nationalize.io`, {
    params: { name }
  });
  
  const data = response.data;
  
  if (!data.country || data.country.length === 0) {
    throw new Error('Nationalize returned an invalid response');
  }
  
  const bestCountry = data.country.reduce((best, current) => 
    current.probability > best.probability ? current : best
  );
  
  return bestCountry;
}


async function consultAllOracles(name) {
  const [genderData, ageData, countryData] = await Promise.all([
    consultGenderize(name),
    consultAgify(name),
    consultNationalize(name)
  ]);
  
  return {
    gender: genderData.gender,
    gender_probability: genderData.probability,
    sample_size: genderData.count,
    age: ageData.age,
    country_id: countryData.country_id,
    country_probability: countryData.probability
  };
}

module.exports = { classifyAgeGroup, consultAllOracles };