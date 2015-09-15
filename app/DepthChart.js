var DepthChart = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired, 
    bindTo: React.PropTypes.string.isRequired, 
    source: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      data: this.props.data
    };
  },

  gatherOrders: {
    bitstamp: function(data){

      var cBids = [];
      var cAsks = [];

      for(i in data.bids){
        cBids.push({ 
          'Price': parseFloat(data.bids[i][0]), 
          'Size': parseFloat(data.bids[i][1]),
          'Cumulative Size': i == 0 ? parseFloat(data.bids[i][1]) : cBids[i-1]['Cumulative Size'] + parseFloat(data.bids[i][1]),
          'Bid': i == 0 ? (parseFloat(data.bids[i][0])*parseFloat(data.bids[i][1])) : cBids[i-1]['Bid'] + (parseFloat(data.bids[i][0])*parseFloat(data.bids[i][1]))
        });
      }

      for(i in data.asks){
        cAsks.push({ 
          'Price': parseFloat(data.asks[i][0]), 
          'Size': parseFloat(data.asks[i][1]), 
          'Cumulative Size': i == 0 ? parseFloat(data.asks[i][1]) : cAsks[i-1]['Cumulative Size'] + parseFloat(data.asks[i][1]),
          'Ask': i == 0 ? (parseFloat(data.asks[i][0])*parseFloat(data.asks[i][1])) : cAsks[i-1]['Ask'] + (parseFloat(data.asks[i][0])*parseFloat(data.asks[i][1]))
        });
      }

      // reverse bid order
      cBids.sort(function(a, b){ return b['Bid'] - a['Bid']; });

      return cBids.concat(cAsks);
    }, 
    finco: function(data){
      if(data.length !== 0){
        var parsedData = { };
        var cBids = [];
        var cAsks = [];
        
        // parse raw data string
        for(t in data){
          var dArray = [];
          var dObjArray = [];
          var d = data[t].split('..')[2].split(' ');  

          // remove empty entries
          for(i in d){ 
            var num = d[i];
            if(num) dArray.push(num);
          }

          // restructure for d3
          for(i in dArray){
            if(i === 0 || i % 2 === 0) dObjArray.push( { price: parseFloat(dArray[i]).toFixed(2).toString() } );  
            else dObjArray[dObjArray.length-1].orderSize = parseFloat(dArray[i]).toFixed(8).toString();
          }

          parsedData[t] = dObjArray;
        }

        // sum and order 
        for(i in parsedData.bids){

          cBids.push({ 
            'Price': parseFloat(parsedData.bids[i].price), 
            'Size': parseFloat(parsedData.bids[i].orderSize),
            'Cumulative Size': i == 0 ? parseFloat(parsedData.bids[i].orderSize) : cBids[i-1]['Cumulative Size'] + parseFloat(parsedData.bids[i].orderSize),
            'Bid': i == 0 ? (parseFloat(parsedData.bids[i].price)*parseFloat(parsedData.bids[i].orderSize)) : cBids[i-1]['Bid'] + (parseFloat(parsedData.bids[i].price)*parseFloat(parsedData.bids[i].orderSize))
          });
        }

        for(i in parsedData.asks){
          cAsks.push({ 
            'Price': parseFloat(parsedData.asks[i].price), 
            'Size': parseFloat(parsedData.asks[i].orderSize), 
            'Cumulative Size': i == 0 ? parseFloat(parsedData.asks[i].orderSize) : cAsks[i-1]['Cumulative Size'] + parseFloat(parsedData.asks[i].orderSize),
            'Ask': i == 0 ? (parseFloat(parsedData.asks[i].price)*parseFloat(parsedData.asks[i].orderSize)) : cAsks[i-1]['Ask'] + (parseFloat(parsedData.asks[i].price)*parseFloat(parsedData.asks[i].orderSize))
          });
        }

        // reverse bid order
        cBids.sort(function(a, b){ return b['Bid'] - a['Bid']; });

        return cBids.concat(cAsks);
      }
    }
  },

  updateChart: function(newData){
    this.setState({ data: this.gatherOrders[this.props.source](newData) });
  },

  componentDidMount: function() {
    c3DepthChart.create(this.props.bindTo, this.props, this.state);
  },

  componentDidUpdate: function() {
    c3DepthChart.update(this.state);
  },

  componentWillUnmount: function() {

  },

  render: function() {
    return (
      <div className="depth-chart-wrapper"></div>
    );
  }
});