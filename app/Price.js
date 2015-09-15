var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Price = React.createClass({
  propTypes: {
    data: React.PropTypes.any.isRequired
  },

  getInitialState: function() {
    return {
      data: this.props.data
    };
  },

  updatePrice: function(newData){
    this.setState({ data: newData });
  },

  render: function(){ 
    console.log(this.state.data);

    var price = this.state.data.bids ? ((parseFloat(this.state.data.asks[0][0]) + parseFloat(this.state.data.bids[0][0])) / 2).toFixed(2) : '--';
    var spread = this.state.data.bids ? ((parseFloat(this.state.data.asks[0][0]) - parseFloat(this.state.data.bids[0][0]))).toFixed(2) : '--';

    return (
      <div>
        <div className='col-xs-6'>
          <ReactCSSTransitionGroup transitionName= {"price"} ><h6 className='center-text price-title'>{ price }</h6></ReactCSSTransitionGroup>
          <p className='=text-muted center-text price-subtitle'>USD Price</p>
        </div>
        <div className='col-xs-6'>
          <ReactCSSTransitionGroup transitionName= {"spread"} ><h6 className='center-text price-title'>{ spread }</h6></ReactCSSTransitionGroup>
          <p className='text-muted center-text price-subtitle'>USD Spread</p>
        </div>
      </div>
    );
  }
});