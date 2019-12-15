import React, { useRef, useState } from 'react';
import { writeToDatabase } from '../helpers/api.js';
import { accountData } from '../config/imgur.js';
import { imageIcon, closeIcon } from '../assets/icons.js';
import './Upload.css';

const MAX_UPLOAD_SIZE = 10000000;
const ACCEPTED_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

const Upload = ({ setModalState }) => {
  const [imagePath, setImagePath] = useState(null);
  const [url, setUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const postTitle = useRef(null);

  const selectFile = (e) => {
    const file = e.target.files[0];
    if (file.size >= MAX_UPLOAD_SIZE) {
      setErrorMessage('Your file exceeds the maximum size allowed.');
    } else if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMessage('The type of file you have selected is not accepted.');
    } else {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        function() {
          setImagePath(reader.result);
        },
        false
      );
      reader.readAsDataURL(file);
    }
  };

  const pasteUrl = (e) => {
    const imageUrl = e.target.value;
    const validPath = /^(http|https):\/\/[\w\W]+\.(jpeg|jpg|png)$/;
    if (validPath.test(imageUrl)) {
      setUrl(imageUrl);
    } else {
      setErrorMessage('The url entered is invalid.');
    }
  };

  const uploadContent = async () => {
    if (imagePath) {
      await fetch(accountData.upload_api, {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${accountData.client_id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imagePath.replace(/^data:image\/(png|jpg);base64,/, ''), type: 'base64' })
      })
        .then((res) => res.json())
        .then(async (json) => {
          await writeToDatabase(json.data.link, title);
        });
    } else {
      await writeToDatabase(url, title);
    }
  };

  const submitPost = async () => {
    if (!title) {
      setErrorMessage('Please enter a title.');
      return false;
    }

    await uploadContent();
    window.location.reload();
  };

  const isImageAvailable = Boolean(imagePath || url);
  return (
    <div className="post-submission">
      <button onClick={() => setModalState((state) => !state)} className="post-close">
        {closeIcon}
      </button>
      <h2
        className="post-title"
        ref={postTitle}
        onInput={(e) => setTitle(e.target.innerText)}
        contentEditable={true}
        placeholder={'Title of your post...'}
      ></h2>
      {!isImageAvailable ? (
        <div className="content-selection-container">
          <div className="image-upload">
            <label htmlFor="image_to_upload">{imageIcon} Select an image to upload</label>
            <input
              className="file-selection"
              id="image_to_upload"
              name="image_to_upload"
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={selectFile}
            />
            <div className="selection-choice">or</div>
            <input
              className="url-selection"
              type="text"
              value={url}
              onChange={pasteUrl}
              placeholder="Paste the url of your image"
            />
          </div>
        </div>
      ) : (
        <div className="image-preview-container">
          <img src={imagePath || url} width="75%" alt="Image preview..." />
          <div className="file-change" onClick={() => setImagePath(null)}>
            Made a mistake? Click here to change file
          </div>
        </div>
      )}
      <button className="post-button-submit" onClick={submitPost} disabled={!(title && isImageAvailable)}>
        Submit
      </button>
      <div className="file-upload-error">{errorMessage}</div>
    </div>
  );
};

export default Upload;
