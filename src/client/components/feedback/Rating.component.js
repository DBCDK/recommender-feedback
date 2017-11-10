import React from 'react';

const labels = [
  'Kan ikke vurdere forslag',
  'Dårligt forslag',
  'Ikke godt forslag',
  'OK forslag',
  'Godt forslag',
  'Rigtig godt forslag'
];
export default class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hoverRating: null};
  }

  renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const label = (
        <div
          key={i}
          className={rating >= i ? 'star-active' : 'star-passive'}
          style={{color: rating === 1 && rating === i ? 'red' : null}}
          onMouseOver={() => {
            this.setState({hoverRating: i});
          }}
          onMouseOut={() => {
            this.setState({hoverRating: null});
          }}
          onClick={() => {
            this.props.onRating(i);
          }}>
          &#9733;
        </div>
      );
      stars.push(label);
    }
    return stars;
  }

  render() {
    const rating = this.state.hoverRating === null ? this.props.rating : this.state.hoverRating;
    return (
      <div style={{display: 'inline-block'}}>
        <div className='rating' >
          {this.renderStars(rating)}
          <div className='no-rate' style={{background: rating === 0 ? 'black' : 'grey'}}
            key='no-rate'
            onMouseOver={() => {
              this.setState({hoverRating: 0});
            }}
            onMouseOut={() => {
              this.setState({hoverRating: null});
            }}
            onClick={() => {
              this.props.onRating(0);
            }}>?</div>
        </div>
        <div className='text-left rating-label'>{labels[rating]}</div>
      </div>
    );
  }
}
