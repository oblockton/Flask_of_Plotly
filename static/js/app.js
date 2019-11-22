

function buildMetadata(sample) {
  let url = `/metadata/${sample}`;
  d3.json(url).then((response) => {
    var metadataText = d3.select('#sample-metadata');
    metadataText.html("");
    console.log(response);
    Object.entries(response).forEach(([key, value]) => {
      console.log(`${key} : ${value}`);
      metadataText.append("p").text(`${key} : ${value}`);
    });
  });
}



function buildCharts(sample) {
  var url =  `/samples/${sample}`;
  d3.json(url).then((data)=> {
    var x = data['otu_ids'];
    var y = data['sample_values'];
    var size_val =data['sample_values'];
    var labels = data['otu_labels'];

    var trace1 = {
      x:x,
      y:y,
      mode:'markers',
      marker:{
        size:size_val,
        color:x,
        label:labels,
        type:'scatter',
        opacity:0.4
      }
    }


    var data_trace = [trace1];
    var layout = {
      title: "Sample size",
      xaxis:{title:'ID'},
      showlegeng:true
    };

    Plotly.newPlot('bubble',data_trace,layout);

    //build pie chart
    var pie_data = [{
      labels:x,
      values:size_val.slice(0,11),
      text:y.slice(0,10),
      hovertext:labels,
      type:'pie'
    }];

    var pie_layout = { title:'% of '}

    Plotly.newPlot('pie',pie_data,pie_layout);
  }); //end of response handling.
}; //END OF BUILD function.



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
