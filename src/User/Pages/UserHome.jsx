import React, { useState} from 'react';
import HomeHero from '../Components/Home/HomeHero';
import HomeBody from '../Components/Home/HomeBody';

function UserHome() {
  const [searchQuery, setSearchQuery] = useState('');


  return (

    <>
      <div style={{ backgroundColor: '#DFF2EB', marginBottom: '0' }}>
        <HomeHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <HomeBody searchQuery={searchQuery} />
      </div>
    </>
  );
}

export default UserHome;
