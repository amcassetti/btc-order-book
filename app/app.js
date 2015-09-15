// app.js
(function() {
  // // bitstamp
  // var bids = React.render(
  //   <Orders data = { [] } type = {'bid'} source = { 'bitstamp' }/>, 
  //   document.getElementById('bids')
  // );

  // var asks = React.render(
  //   <Orders data = { [] } type = {'ask'} source = { 'bitstamp' }/>, 
  //   document.getElementById('asks')
  // );

  // var depthChart = React.render(
  //   <DepthChart data = { [] } bindTo = { '#depth-chart' } source = 'bitstamp'/>, 
  //   document.getElementById('depth-chart')
  // );

  // var price = React.render(
  //   <Price data = { [] } />, 
  //   document.getElementById('price-container')
  // );
   
  // var pusher = new Pusher('de504dc5763aeef9ff52');
  // var orderChannel = pusher.subscribe('order_book');
  
  // orderChannel.bind('data', function(data) {
  //     bids.updateOrders(data.bids);
  //     asks.updateOrders(data.asks);
  //     depthChart.updateChart(data);
  //     price.updatePrice(data);
  // });

  // $(document).on('show', function() {
  //   pusher = new Pusher('de504dc5763aeef9ff52');
  //   orderChannel = pusher.subscribe('order_book');
  //   orderChannel.bind('data', function(data) {
  //     bids.updateOrders(data.bids);
  //     asks.updateOrders(data.asks);
  //     depthChart.updateChart(data);
  //     price.updatePrice(data);
  //   });
  // });

  // $(document).on('hide', function() {
  //   pusher.disconnect();
  // });

  // finco
  var bids = React.render(
    <Orders data = { [] } type = {'bid'} source = { 'finco' }/>, 
    document.getElementById('bids')
  );

  var asks = React.render(
    <Orders data = { [] } type = {'ask'} source = { 'finco' }/>, 
    document.getElementById('asks')
  );

  var depthChart = React.render(
    <DepthChart data = { [] } bindTo = { '#depth-chart' } source = 'finco'/>, 
    document.getElementById('depth-chart')
  );

  var price = React.render(
    <Price data = { [] } />, 
    document.getElementById('price-container')
  );

  setInterval(function(){
    $.get('http://66.128.49.82:5011/?reverse%20select%20bids%20from%20market%20where%20sym=`BTCUSD,venue=`Bitstamp', function(bidData){
      bids.updateOrders(bidData);
      $.get('http://66.128.49.82:5011/?reverse%20select%20asks%20from%20market%20where%20sym=`BTCUSD,venue=`Bitstamp', function(askData){
        asks.updateOrders(askData);
        depthChart.updateChart({
          'bids': bidData, 
          'asks': askData
        });
        price.updatePrice({
          'bids': [[bids.gatherOrders.finco(bidData)[0].price]], 
          'asks': [[asks.gatherOrders.finco(askData)[0].price]]
        });
      });
    });
  }, 5000);

  // fake data
  d3.csv("./data/price_data.csv", function(error, csv) {
      d3OhlcChart.create('#price-chart', { }, { data: csv });
  });
})();



