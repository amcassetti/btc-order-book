var c3DepthChart = { };

c3DepthChart.chart = null;

c3DepthChart.create = function(bindTo, props, state){
  c3DepthChart.chart = c3.generate({
    bindto: bindTo,
    padding: {
      top: 15,
      right: 15,
      left: 50
    },
    data: {
      json: state.data, 
      keys: {
        // x: ['Price'],
        value: ['Bid', 'Ask']
      },
      types: {
          'Bid': 'area-step', 
          'Ask': 'area-step'
      },
      colors: {
        'Bid': 'green', 
        'Ask': 'red'
      }, 
      onmouseover: function () { 
        d3.selectAll('.c3-circles-Bid>circle, .c3-circles-Ask>circle').attr('r', 2).attr('opacity', 1);
        // $('.c3-tooltip-container').css('display', 'block !important');
      }, 
      onmouseout: function () { 
        d3.selectAll('.c3-circles-Bid>circle, .c3-circles-Ask>circle').attr('r', 2).attr('opacity', 1);
        // $('.c3-tooltip-container').css('display', 'none !important');
      }
    }, 
    axis: {
      x: {
         label: 'Price',
         type: 'category',
         tick: {
            count: 10,
            format: function (x) { 
               // console.log(x, c3DepthChart.update.getParentState());
               x = parseInt(x);
               if(c3DepthChart.update.getParentState()){
                return numeral(c3DepthChart.update.getParentState().data[x]['Price']).format('$0.00');
               }
               else {
                return x;
               }
            }
          }
      }, 
      y: {
         label: 'Value',
         tick: {
            count: 7,
            format: function (y) { 
               return numeral(y).format('$0.0a'); 
            }
          }
      }, 
      // y2: {
      //   show: true, 
      //   tick: {
      //     count: 7,
      //     format: function (y, i) {
      //       if(d3.selectAll('.c3-axis-y>.tick>text>tspan')[0][10*y])
      //         return d3.selectAll('.c3-axis-y>.tick>text>tspan')[0][10*y].innerHTML;
      //     }
      //   }
      // }
    },
    point: {
      show: true
    },
    grid: {
      // x: {
      //   lines: [
      //     {
      //       value: 275.2, 
      //       text: 'Lable 1'
      //     }
      //   ]
      // },
      y: {
        show: true
      }
    },
    tooltip: {
      format: {
        title: function (x, y) { 
          var d = c3DepthChart.update.getParentState().data[x];
          return numeral(d['Price']).format('0.00') + ' <span class="currency-label text-muted">USD</span>'; 
        }, 
        value: function (value, ratio, id, index) { 
          var d = c3DepthChart.update.getParentState().data[index];
          var string = 
            '<p class="text-muted tooltip-title">' 
            + (d['Bid'] ? 'Can be sold:' : 'Can be bought:') 
            +'</p>'
            +'<p>' 
            + d['Cumulative Size'].toFixed(4) 
            + ' <span class="currency-label text-muted">BTC</span>' 
            +'</p>'
            +'<p class="text-muted tooltip-title">' 
            + 'For a total of:'
            +'</p>'
            +'<p>' 
            + (d['Bid'] ? numeral(d['Bid']).format('0,0.00') : numeral(d['Ask']).format('0,0.00')) 
            + ' <span class="currency-label text-muted">USD</span>' 
            +'</p>'
            ;
          return string; 
        }
      }
    }, 
    legend: {
      show: false
    }, 
    onrendered: function () { 
      d3.selectAll('.c3-circles-Bid>circle, .c3-circles-Ask>circle').attr('r', 2).attr('opacity', 1);
    }
  });
};

c3DepthChart.update = function(state) {

  c3DepthChart.update.getParentState = function(){
    return state;
  }

  c3DepthChart.chart.load({
    json: state.data,
    keys: {
      value: ['Bid', 'Ask']
    }
  });
};

c3DepthChart.destroy = function() {
};

