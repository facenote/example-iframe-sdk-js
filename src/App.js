import './App.css';
import {useEffect, useRef, useState} from 'react';
import Facenote from '@facenote/webapp-sdk';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const iframe = useRef(null);
  const [didMount, setDidMount] = useState(false);

  useEffect(() => { setDidMount(true) }, [])

  useEffect(() => {
    async function init() {
     
      // These are the credentials that should be used for testing
      const clientId = '';
      const clientSecret = '';
      const deviceId = '';
      
      // Creating a new instance of the Facenote SDK
      const facenote = new Facenote();

      // Initializing the SDK with the credentials
      await facenote.initialize(clientId, clientSecret, deviceId);

      // Create a random userId for each user with a number at the end.
      //   This user id should be the one that you use to identify the user in your system
      const userId = `user-${uuidv4()}`;

      // This is the callback that will be called when the onboarding process is finished
      const eventCallback = (event) => {
        console.log('Event:', event);
        closeModal();
      };

      // Start the onboarding process
      await facenote.onboarding(userId, undefined, { 
        language: 'es',
        iframe: iframe.current,
        trackingId: `facenote-test-${uuidv4()}`,

      }, eventCallback);
    };

    if(didMount && modalIsOpen) init();
  }, [didMount, modalIsOpen]);

  return (
    <div className="App">
      <button onClick={openModal}>Onboarding</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{ overlay: {}, content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          borderRadius: 15,
          transform: 'translate(-50%, -50%)',
        } }}
      >
        <iframe
          ref={iframe}
          style={{ backgroundColor: '#fff', border: 0 }}
          title="example-iframe"
          height="600"
          width="400"
        />
      </Modal>
    </div>
  );
}

export default App;