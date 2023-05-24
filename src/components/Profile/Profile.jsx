import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';

export default function Profile(props) {
  const [copied, setCopied] = useState(false);
  const count = 6;

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(props.publicKey);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } else { // fallback for older browsers or mobiles
      const textarea = document.createElement('textarea');
      textarea.value = props.publicKey;
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="card p-3 profile-container">
      <img
        src={props.image}
        style={{ borderRadius: '50%' }}
        className="card-img-top profile-image img-fluid small-profile mx-auto"
        alt="..."
      />
      <div className="card-body">
        <h3 className="card-title my-2">{props.name}</h3>
        <div className="d-flex align-items-center">
          <h5 className="text-secondary mb-0">
            {props.publicKey.slice(0, count)}
            {props.publicKey.length > count && '...'}
          </h5>
          <button
            className="btn btn-link text-dark p-0 ms-2"
            data-toggle="tooltip"
            title='Copy'
            onClick={copyToClipboard}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
          {copied && (
            <span className="text-success ms-2">Copied to clipboard</span>
          )}
        </div>
        <hr className="divider" />
        <h5 className="card-subtitle">{props.nickName}</h5>
        <hr className="divider" />
        <div />
        <div />
        <div className='profile-stats'>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Posts:</strong> {props.postCount}
            </li>
            <li className="list-group-item">
              <strong>Earned:</strong> {props.money}
            </li>
            <li className="list-group-item">
              <strong>Followers:</strong> {props.followerCount}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
