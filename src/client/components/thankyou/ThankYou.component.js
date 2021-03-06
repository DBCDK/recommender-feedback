import React from 'react';
import {HISTORY_PUSH, ON_LOGOUT_REQUEST, SEARCH_INIT} from '../../redux';

export default function ThankYou(props) {
  return (
    <div className="thankyou container col-md-6 col-centered">

      <h2 className='text-center'>Tak for hjælpen</h2>
      <p>
        Vi arbejder på at gøre vores læseforslag bedre, så vi kan give bedre inspiration til brugerne online og på det fysiske bibliotek. Du har lige hjulpet os - mange tak!
      </p>
      <p className='mb-0'>
        Med venlig hilsen
      </p>
      <p>
        Læsekompasset / DBC
      </p>
      <p className='mt-4'>
        Vil du prøve igen eller logge ud?
      </p>
      <div className='mt-4'>
        <button className='btn btn-primary' onClick={() => {
          props.dispatch({type: ON_LOGOUT_REQUEST});
        }}>Log ud</button>
        <button className='btn btn-primary ml-2' onClick={() => {
          props.dispatch({type: SEARCH_INIT});
          props.dispatch({type: HISTORY_PUSH, path: '/søg'});
        }}>Prøv igen</button>
      </div>
    </div>
  );
}
