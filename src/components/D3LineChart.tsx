import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface DataPoint {
  week_start_date: string;
  value: number;
}

interface LineChartProps {
  data: {
    existingPatients: DataPoint[];
    newPatients: DataPoint[];
  };
  width?: number;
  height?: number;
}

export function D3LineChart({
  data,
  width = 800,
  height = 400,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hideExisting, setHideExisting] = useState(false);
  const [hideNew, setHideNew] = useState(false);
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: "",
  });

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const margin = { top: 40, right: 80, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear existing chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Add tooltip div
    const tooltipDiv = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px");

    // Create scales
    const allDates = [...data.existingPatients, ...data.newPatients].map(
      (d) => new Date(d.week_start_date)
    );
    const allValues = [...data.existingPatients, ...data.newPatients].map(
      (d) => d.value
    );

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(allDates) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(allValues) || 0])
      .range([innerHeight, 0])
      .nice();

    // Create chart group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      );

    // Create line generator
    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(new Date(d.week_start_date)))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add moving averages
    const movingAverage = (data: DataPoint[], windowSize: number) => {
      return data.map((_, i) => {
        const start = Math.max(0, i - windowSize + 1);
        const window = data.slice(start, i + 1);
        return {
          week_start_date: data[i].week_start_date,
          value: d3.mean(window, (d) => d.value) || 0,
        };
      });
    };

    // Draw lines and areas for each series
    if (!hideExisting) {
      // Existing patients line
      g.append("path")
        .datum(data.existingPatients)
        .attr("class", "line existing")
        .attr("fill", "none")
        .attr("stroke", "rgb(75, 192, 192)")
        .attr("stroke-width", 2.5)
        .attr("d", line);

      // Moving average for existing patients
      g.append("path")
        .datum(movingAverage(data.existingPatients, 3))
        .attr("class", "ma-line")
        .attr("fill", "none")
        .attr("stroke", "rgb(75, 192, 192)")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "3,3")
        .attr("d", line);
    }

    if (!hideNew) {
      // New patients line
      g.append("path")
        .datum(data.newPatients)
        .attr("class", "line new")
        .attr("fill", "none")
        .attr("stroke", "rgb(255, 99, 132)")
        .attr("stroke-width", 2.5)
        .attr("d", line);

      // Moving average for new patients
      g.append("path")
        .datum(movingAverage(data.newPatients, 3))
        .attr("class", "ma-line")
        .attr("fill", "none")
        .attr("stroke", "rgb(255, 99, 132)")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "3,3")
        .attr("d", line);
    }

    // Add interactive dots
    const addDots = (data: DataPoint[], className: string, color: string) => {
      g.selectAll(`.dot-${className}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", `dot-${className}`)
        .attr("cx", (d) => xScale(new Date(d.week_start_date)))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 6)
        .attr("fill", color)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => {
          const date = new Date(d.week_start_date).toLocaleDateString();
          tooltipDiv
            .html(
              `
            <div>
              <strong>${date}</strong><br/>
              Value: ${d.value}<br/>
              ${className === "existing" ? "Existing" : "New"} Patients
            </div>
          `
            )
            .style("visibility", "visible")
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", () => {
          tooltipDiv.style("visibility", "hidden");
        });
    };

    if (!hideExisting)
      addDots(data.existingPatients, "existing", "rgb(75, 192, 192)");
    if (!hideNew) addDots(data.newPatients, "new", "rgb(255, 99, 132)");

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d")));

    g.append("g").call(d3.axisLeft(yScale));

    // Add interactive legend
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right + 20}, ${margin.top})`
      );

    const legendItems = [
      {
        label: "Existing Patients",
        color: "rgb(75, 192, 192)",
        hidden: hideExisting,
        toggle: setHideExisting,
      },
      {
        label: "New Patients",
        color: "rgb(255, 99, 132)",
        hidden: hideNew,
        toggle: setHideNew,
      },
    ];

    legendItems.forEach((item, i) => {
      const legendGroup = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 25})`)
        .style("cursor", "pointer")
        .on("click", () => item.toggle(!item.hidden));

      legendGroup
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", item.color)
        .attr("opacity", item.hidden ? 0.3 : 1);

      legendGroup
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(item.label)
        .attr("opacity", item.hidden ? 0.3 : 1);
    });
  }, [data, width, height, hideExisting, hideNew]);

  return <svg ref={svgRef} />;
}
