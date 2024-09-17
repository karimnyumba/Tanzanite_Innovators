import React, { useState }from 'react';
import './CropInfo.css'; // Import your existing CSS file

const cropCategories = ['All', 'Crops', 'Fruits', 'Vegetables'];


const cropsData = [
  {
    name: 'Corn',
    image: 'https://via.placeholder.com/150x150?text=Corn', // Placeholder image
    description: 'Corn is a cereal grain native to Central America. It is the most widely cultivated cereal grain in the world.',
    state: 'Widely Grown',
    category: 'Crops', // Add category: 'Crops'
  },
  {
    name: 'Soybean',
    image: 'https://via.placeholder.com/150x150?text=Soybean', // Placeholder image
    description: 'Soybean is a legume from East Asia, widely grown for its edible beans. It is a major source of vegetable protein and oil.',
    state: 'Major Producer: USA, Brazil',
    category: 'Crops', // Add category: 'Crops'
  },
  {
    name: 'Wheat',
    image: 'https://via.placeholder.com/150x150?text=Wheat', // Placeholder image
    description: 'Wheat is a cereal grain widely grown on most continents. It is a major source of nutrition and used in various food products.',
    state: 'Global Staple Food',
    category: 'Crops', // Add category: 'Crops'
  },
  {
    name: 'Rice',
    image: 'https://via.placeholder.com/150x150?text=Rice', // Placeholder image
    description: 'Rice is a cereal grain native to Southeast Asia, and the most widely consumed staple food for a large part of the world\'s population.',
    state: 'Essential Food Source',
    category: 'Crops', // Add category: 'Crops'
  },
  {
    name: 'Barley',
    image: 'https://via.placeholder.com/150x150?text=Barley', // Placeholder image
    description: 'Barley is a cereal grain grown in temperate climates globally. It is used for brewing beer, as animal feed, and in various food products.',
    state: 'Ancient Grain',
    category: 'Crops', // Add category: 'Crops'
  },
  {
    name: 'Tomato',
    image: 'https://via.placeholder.com/150x150?text=Tomato', // Placeholder image
    description: 'Tomato is a fruit (considered a vegetable in culinary terms) native to South America. It is a major agricultural crop used for fresh consumption, processing, and sauces.',
    state: 'Globally Important Vegetable',
    category: 'Vegetables', // Add category: 'Vegetables'
  },
  {
    name: 'Potato',
    image: 'https://via.placeholder.com/150x150?text=Potato', // Placeholder image
    description: 'Potato is a starchy tuber vegetable native to the Andes mountains in South America. It is a major food source globally.',
    state: 'Fourth Largest Food Crop',
    category: 'Vegetables', // Add category: 'Vegetables'
  },
  {
    name: 'Cotton',
    image: 'https://via.placeholder.com/150x150?text=Cotton', // Placeholder image
    description: 'Cotton is a soft fiber grown for use in textiles. It is the most widely used natural fiber globally and has a significant impact on the textile industry.',
    state: 'Major Cash Crop',
    category: 'Others', // Add category: 'Others' (assuming it's not a crop or vegetable)
  },
];


const CropInfo = () => {
const [selectedCategory, setSelectedCategory] = useState('All');
const [filteredCrops, setFilteredCrops] = useState(cropsData); // Pre-calculate filtered crops

const handleCropCategoryChange = (event) => {
  setSelectedCategory(event.target.value);
  const filtered = cropsData.filter((crop) => crop.category === event.target.value || event.target.value === 'All');
  setFilteredCrops(filtered);
};


  return (
    <div className='crop-container'>
      <h1>Crop Information</h1>
      <div className='category-filter'>
      <select value={selectedCategory} onChange={handleCropCategoryChange}>
        {cropCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
      <div className='crop-cards'>
      {filteredCrops.map((crop) => (
        <div key={crop.name} className='crop-card'>
          <img src={crop.image} alt={crop.name} />
            <h2>{crop.name}</h2>
            <p>{crop.description}</p>
            <span>{crop.state}</span>
        </div>
      ))}
      </div>
    </div>
  );
};

export default CropInfo;
