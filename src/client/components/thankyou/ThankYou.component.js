import React from 'react';

export default function ThankYou() {
  return (
    <div className="thankyou container text-center">
      <h2>Mange tak for din indsats</h2>
      <p className="thankyou--p">
        Vil du prøve igen?{' '}
        <a className="btn btn-success" href="/søg">
          Start Forfra her <span className="glyphicon glyphicon-arrow-right"/>
        </a>
      </p>
      <div className="thankyou--team">
        <b>Læsekompas-teamet</b>
        <p>Sarah, Christian, Jacob og Anders</p>
      </div>
    </div>
  );
}
