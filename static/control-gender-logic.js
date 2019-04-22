anychart.onDocumentReady(function () {
    // create data set
    // var dataSet = anychart.data.set(getData());
    d3.json("/data/control-gender", raw_data => {

        var dataSet = anychart.data.set(raw_data);
        // map data for the first series, take x from the zero column and value from the first column of data set
        var seriesData_1 = dataSet.mapAs({'x': 0, 'value': 1});

        // map data for the second series, take x from the zero column and value from the second column of data set
        var seriesData_2 = dataSet.mapAs({'x': 0, 'value': 2});

        // create bar chart
        var chart = anychart.bar();

        // turn on chart animation
        chart.animation(true);

        // set padding
        chart.padding([10, 20, 5, 20]);

        // force chart to stack values by Y scale.
        chart.yScale().stackMode('value');

        // format y axis labels so they are always positive
        chart.yAxis().labels().format(function () {
            return Math.abs(this.value).toLocaleString();
        });

        // set title for Y-axis
        chart.yAxis(0).title('percentages');

        // allow labels to overlap
        chart.xAxis(0).overlapMode('allow-overlap');

        // turn on extra axis for the symmetry
        chart.xAxis(1)
                .enabled(true)
                .orientation('right')
                .overlapMode('allow-overlap');

        // set chart title text
        chart.title('Means of Control by Gender');

        chart.interactivity().hoverMode('by-x');

        chart.tooltip()
                .title(false)
                .separator(false)
                .displayMode('separated')
                .positionMode('point')
                .useHtml(true)
                .fontSize(12)
                .offsetX(5)
                .offsetY(0)
                .format(function () {
                    return  Math.abs(this.value).toLocaleString() + '<span style="color: #D9D9D9">%</span>';
                });

        // temp variable to store series instance
        var series;

        // create first series with mapped data
        series = chart.bar(seriesData_1);
        series.name('Males')
                .color('#0080FF');
        series.tooltip()
                .position('right')
                .anchor('left-center');

        // create second series with mapped data
        series = chart.bar(seriesData_2);
        series.name('Females')
            .color('HotPink');
        series.tooltip()
                .position('left')
                .anchor('right-center');

        // turn on legend
        chart.legend()
                .enabled(true)
                .inverted(true)
                .fontSize(13)
                .padding([0, 0, 20, 0]);

        // set container id for the chart
        chart.container('chart-container');

        // initiate chart drawing
        chart.draw();
    });
});