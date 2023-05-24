import React, { useState, useEffect } from "react";
import axios from 'axios';

import Post from "../Posts/Post";
import NewPost from "../Posts/NewPost";
import Profile from "../Profile/Profile";
import Quicks from "../Quicks/Quicks";
import Search from "../Search/Search";

import "./ProfilePage.css";

import profilePhoto from "../../assets/images/profile-img3.png";
import postPhoto1 from "../../assets/images/post-img2.png";

function ProfilePage() {
  const [isHovering, setIsHovering] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const quicks = [
    { title: "Groups", list: ["Group 1", "Group 2", "Group 3"] },
    { title: "Friends", list: friendList },
  ];

  useEffect(() => {
    if (isHovering) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isHovering]);

  useEffect(() => {
    async function fetchFriends() {
      try {
        if (selectedPerson) {
          const response = await axios.get(`http://localhost:5000/persons/${selectedPerson.publicKey}/friends`);
          setFriendList(response.data.friendNames);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchFriends();
  }, [selectedPerson]);

  const handlePersonClick = async (personId) => {
    try {
      const response = await axios.get(`http://localhost:5000/persons/${personId}`);
      setSelectedPerson(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="row">
        {/* profile section */}
        <div className="col-sm-12 col-md-3 my-2">
          {selectedPerson && (
            <Profile
              name={selectedPerson.name}
              nickName="EnderDragon"
              image={profilePhoto}
              publicKey={selectedPerson.publicKey}
              postCount={0}
              followerCount={0}
              followCount={0}
              money={0}
            />
          )}
        </div>

        {/* post section */}
        <div className="col-sm-12 col-md-6 my-2 py-2">
          <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <NewPost />
            <Post
              userName={selectedPerson?.name}
              userNickName="EnderDragon"
              profileImage={profilePhoto}
              postImage={postPhoto1}
              description="Very Beautifulllllll......"
              tags={["#Lala", "#Butt", "#Software_Engineer"]}
              likeCount={0}
              commentCount={0}
              starCount={0}
            />
          </div>
        </div>

        {/* Right profile section */}
        <div className='col-sm-12 col-md-3 my-2'>
          <Search onPersonClick={handlePersonClick} />
          {quicks.map((item, index) => (
            <Quicks
              title={item.title}
              list={item.title === "Friends" ? friendList : item.list}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
