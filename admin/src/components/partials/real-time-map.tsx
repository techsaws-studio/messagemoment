"use client";

import React, { useEffect } from "react";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import * as am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

import { RealTimeMapProps } from "@/interfaces/partials-components-interfaces";

const RealTimeMap = ({ MapData }: RealTimeMapProps) => {
  useEffect(() => {
    const root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow.default,
        exclude: ["AQ"],
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      toggleKey: "active",
      interactive: true,
      fill: am5.color(0xe3e6e8),
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0xa8a8a8),
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: am5.color(0x000000),
    });

    let previousPolygon: am5map.MapPolygon | null = null;

    polygonSeries.mapPolygons.template.on(
      "active",
      function (active, target: am5map.MapPolygon | undefined) {
        if (!target) return;

        if (previousPolygon && previousPolygon !== target) {
          previousPolygon.set("active", false);
        }

        const dataItem =
          target.dataItem as am5.DataItem<am5map.IMapPolygonSeriesDataItem> | null;

        if (target.get("active") && dataItem) {
          polygonSeries.zoomToDataItem(dataItem);
        } else {
          chart.goHome();
        }

        previousPolygon = target;
      }
    );

    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push(() => {
      const container = am5.Container.new(root, {
        tooltipText: "{countryName}\nSessions: {session}",
        cursorOverStyle: "pointer",
      });

      const circle = container.children.push(
        am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(0x494af8),
          strokeOpacity: 0,
        })
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const outerCircle = container.children.push(
        am5.Circle.new(root, {
          radius: 15,
          fill: am5.color(0x000000),
          stroke: am5.color(0xffffff),
          strokeWidth: 3,
          strokeOpacity: 1,
        })
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sessionLabel = container.children.push(
        am5.Label.new(root, {
          text: "20",
          fontFamily: "Jetbrains mono",
          fill: am5.color(0xffffff),
          centerY: am5.p50,
          centerX: am5.p50,
          fontSize: 10,
        })
      );

      circle.animate({
        key: "scale",
        from: 0.5,
        to: 5,
        duration: 900,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity,
      });

      circle.animate({
        key: "opacity",
        from: 0.5,
        to: 0.1,
        duration: 900,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity,
      });

      return am5.Bullet.new(root, {
        sprite: container,
      });
    });

    pointSeries.data.setAll(
      MapData.map((data) => ({
        geometry: {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        },
        countryName: data.countryName,
        session: data.session,
      }))
    );

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [MapData]);

  return <div id="chartdiv" className="h-full w-full" />;
};

export default RealTimeMap;
