var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Orders = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    source: React.PropTypes.string.isRequired,
    data: React.PropTypes.any.isRequired
  },

  getInitialState: function() {
    return {
      data: this.props.data
    };
  },

  gatherOrders: {
    finco : function(data){
      if(data.length > 0){
        var dArray = [];
        var dObjArray = [];

        data = data.split('..')[2].split(' ');  

        // remove empty entries
        for(i in data){ 
          var num = data[i];
          if(num) dArray.push(num);
        }

        // restructure for d3
        for(i in dArray){
          if(i === 0 || i % 2 === 0) dObjArray.push( { price: parseFloat(dArray[i]).toFixed(2).toString() } );  
          else dObjArray[dObjArray.length-1].orderSize = parseFloat(dArray[i]).toFixed(8).toString();
        }

        return dObjArray.slice(0,20);
      } else {
        return [];
      }
    },
    bitstamp: function(data){
      var dObjArray = []; 

      // remove empty entries
      for(i in data){ 
        dObjArray.push({ price: data[i][0], orderSize: data[i][1] });
      }

      return dObjArray;
    }
  },

  updateOrders: function(newData){
    this.setState({ data: newData });
  },

  findLargestOrderSize: function(orders){
    return Math.max.apply(Math,orders.map(function(o){
      return parseFloat(o.orderSize);
    }));
  },

  render: function(){ 
    // console.log('orders render');
    var type = this.props.type;
    var orderData = this.gatherOrders[this.props.source](this.state.data);
    if(type == 'ask') orderData.reverse(); // reverse order for ui display
    var largestOrderSize = this.findLargestOrderSize(orderData);
    var orders = orderData.map(function(order){

      var sizeNumLabel = '', 
          sizeZerosLabel = '', 
          sizeTotalStr = order.orderSize, 
          sizeNetNumStr = parseFloat(order.orderSize).toString(), 
          priceStrArray = order.price.split('.'),
          priceStrLeft = priceStrArray[0]+'.', 
          priceStrRight = priceStrArray[1];

      if(sizeTotalStr.length !== sizeNetNumStr.length){
        sizeNumLabel = sizeNetNumStr;
        sizeZerosLabel = sizeTotalStr.substr(sizeNetNumStr.length, sizeTotalStr.length);
        // console.log(sizeTotalStr, sizeNetNumStr, sizeNumLabel, sizeZerosLabel);
      } else {
        sizeNumLabel = sizeTotalStr;
      }

      var barWidth = 15 * (parseFloat(sizeTotalStr) / largestOrderSize) + 1;

      return (
        <li key = { sizeNumLabel + sizeZerosLabel + order.price } >
          <div className='order-container'>
            <div className='col-xs-8'>
              <div className= {'order-size-bar order-size-bar-'+type} style={{width: barWidth+'%'}} ></div>
              <div>
                <span className='order-size-zeros pull-right'>
                  <span>{ sizeZerosLabel }</span>
                </span>
                <span className='order-size-num pull-right'>
                  <span>{ sizeNumLabel }</span>
                </span>
              </div>
              
            </div>
            <div className='col-xs-4 center-text'><span className={ 'order-price-left-'+type }>{ priceStrLeft }</span><span className={ 'order-price-right-'+type }>{ priceStrRight }</span></div>
          </div>
        </li>
      );
    });

    return (
      <div>
        <ul>
          <ReactCSSTransitionGroup transitionName= {"neworder-" + type} >
            { orders }
          </ReactCSSTransitionGroup>
        </ul>
      </div>
    );
  }
});