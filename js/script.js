document.addEventListener("DOMContentLoaded", () => {
    // 
    // PART 1: 
    // testing out basic javascript
    const addBtn = document.getElementById("secOneBtn");
    const removeBtn = document.getElementById("secOneBtnDelete");
    const newListCounter = document.getElementById("newListCounter");
    const alertP = document.getElementById("alertP");

    console.log(addBtn);
    console.log(newListCounter);

    let btnCounter = 0;
    addBtn.addEventListener("mouseup", () => {
        alertP.style.display = "none";

        const newBullet = document.createElement("li");
        const newBulletText = document.createTextNode("I am a new element with count: " + String(btnCounter));

        newBullet.appendChild(newBulletText);
        newListCounter.appendChild(newBullet);

        btnCounter += 1;
    });

    removeBtn.addEventListener("mouseup", () => {
        if (newListCounter.childNodes.length == 0) {
            alertP.style.display = "block";
        } else {
            alertP.style.display = "none";
            newListCounter.removeChild(newListCounter.lastElementChild);
        }

    });

    // 
    // PART 2:
    // D3 intro
    // data
    function generateData(dataLen, lastIndex, upperLimit) {
        const x = [...Array(dataLen)].map(() => Math.floor(Math.random() * upperLimit))
        const y = [...Array(dataLen)].map(() => Math.floor(Math.random() * upperLimit))
        const ids = [...Array(dataLen)].map((_, i) => i + lastIndex);

        const data = ids.map((id, i) => {
            return({
                id: id,
                x: x[i],
                y: y[i]
            });
        });

        return(data);
    }

    // make d3 friendly array
    let data = generateData(30, 0, 100);

    console.log(data);

    // some styling settings
    const height = 500,
        width = 500,
        margin = {left: 70, bottom: 50, top: 30, right: 10};

    const chartHeight = height - margin.bottom - margin.top;
    const chartWidth = width - margin.left - margin.right;

    // create our drawing svg
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // create g element for x axis
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top) + ')')
        .attr('class', 'axis x');

    // create g element for y axis
    svg.append("g")
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
        .attr('class', 'axis y')

    // create g element for actual plot
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr("class", 'scatterG');

    // Define xAxis and yAxis functions
    const xAxis = d3.axisBottom();
    const yAxis = d3.axisLeft();

    const xScale = d3.scaleLinear();
    const yScale = d3.scaleLinear();
    const padScale = 1.05;

    function draw() {
        const xMax = d3.max(data, (d) => +d.x) * padScale;
        // const xMin = d3.min(data, (d) => +d.x);

        xScale.range([0, chartWidth]).domain([0, xMax]);

        // const yMin = d3.min(data, (d) => +d.y);
        const yMax = d3.max(data, (d) => +d.y) * padScale;
        yScale.range([chartHeight, 0]).domain([0, yMax]);

        xAxis.scale(xScale);
        yAxis.scale(yScale);
        svg.select('.axis.x').transition().duration(1000).call(xAxis);
        svg.select('.axis.y').transition().duration(1000).call(yAxis);

        // create the data join
        // const points = svg.select(".scatterG")
        //     .selectAll("circle")
        //     .data(data, (d) => d.id)
        //     .attr("fill", "#dddddd"); // will also set the color of existing circles

        // // the "enter" stage of the data join
        // // where new data objects are assigned a new <circle>
        // points.enter()
        //     .append('circle')
        //     .attr('fill', '#222222')
        //     .attr('cx', (d) => xScale(d.x))
        //     .attr('cy', (d) => yScale(d.y))
        //     .attr('r', 0)
        //     .transition()            
        //     .duration(500)
        //     .attr("r", 3);

        // // the "exit" stage of the data join
        // // where <circle> corresponding to removed data objects are removed
        // points.exit()
        //     .attr("fill", "red")
        //     .attr("r", 5)
        //     .transition()
        //     .duration(1500)
        //     .attr("r", 0)
        //     .remove();

        // for those who are learning from d3 v5 (the newest version)
        // this is the new code
        svg.select(".scatterG")
            .selectAll("circle")
            .data(data, (d) => d.id)
            .join(
                enter => enter.append("circle")
                    .attr('cx', (d) => xScale(d.x))
                    .attr('cy', (d) => yScale(d.y))
                    .attr('r', 0)
                    .call(enter => enter.transition()
                        .duration(500)
                        .attr("r", 3)),
                update => update
                    .attr("fill", "#dddddd"),
                exit => exit.attr("fill", "red")
                    .attr("r", 5)
                    .call(exit => exit.transition()
                        .duration(1000)
                        .remove())
                );
    };

    // call for initial data
    draw();

    document.getElementById("addPointsBtn").addEventListener("mouseup", () => {
        const newData = generateData(5, data[data.length - 1].id + 1, 100);

        data = data.concat(newData);
        draw();
    });

    document.getElementById("removeLastBtn").addEventListener("mouseup", () => {
        data.pop();
        draw();
    });

});