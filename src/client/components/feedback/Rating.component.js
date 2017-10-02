import React from 'react';

const labels = [
  'Kan ikke vurdere',
  'Hæslig',
  'Dårlig',
  'OK',
  'God',
  'Super-duper',
  'Perfekt'
];
export default class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hoverRating: null};
  }

  renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 6; i++) {
      const label = (
        <div
          key={i}
          className={rating >= i ? 'star-active' : 'star-passive'}
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
          <div className='no-rate'
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
