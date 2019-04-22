anychart.onDocumentReady(function () {
    // create data set on our data
    d3.json('/data/control-age', raw_data => {
        var dataSet = anychart.data.set(raw_data);

        // map data for the first series, take x from the zero column and value from the first column of data set
        var seriesData_1 = dataSet.mapAs({'x': 0, 'value': 1});

        // map data for the second series, take x from the zero column and value from the second column of data set
        var seriesData_2 = dataSet.mapAs({'x': 0, 'value': 2});

        // create column chart
        var chart = anychart.column();

        // turn on chart animation
        chart.animation(true);

        // set chart title text settings
        chart.title('Means of Control by Age Group');

        // temp variable to store series instance
        var series;

        // helper function to setup label settings for all series
        var setupSeries = function (series, name) {
            series.name(name);
            series.selected()
                    .fill('#f48fb1 0.8')
                    .stroke('1.5 #c2185b');
        };

        // create first series with mapped data
        series = chart.column(seriesData_1);
        series.xPointPosition(0.25);
        setupSeries(series, 'Adult');

        // create second series with mapped data
        series = chart.column(seriesData_2);
        series.xPointPosition(0.45);
        setupSeries(series, 'Child');

        // set chart padding
        chart.barGroupsPadding(0.3);

        // format numbers in y axis label to match browser locale
        chart.yAxis().labels().format('{%Value}{groupsSeparator: }%');

        // set titles for Y-axis
        chart.yAxis().title('Percentage');

        // turn on legend
        chart.legend()
                .enabled(true)
                .fontSize(13)
                .padding([0, 0, 20, 0]);

        chart.interactivity().hoverMode('single');

        chart.tooltip().format('{%Value}{groupsSeparator: }%');

        // set container id for the chart
        chart.container('chart-container');

        // initiate chart drawing
        chart.draw();
    });
});