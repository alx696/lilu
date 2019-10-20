const a = {
  init() {
    let offlineBoxSource = new ol.source.Vector({
      wrapX: false
    });
    let offlineBoxMarkerStyle = new ol.style.Style({
      image: new ol.style.Icon({
        src: 'i/crosshair.png'
      })
    });
    let offlineBoxAddPoint = (lonLat) => {
      let iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(
            ol.proj.fromLonLat(lonLat)
        )
      });
      iconFeature.setStyle(offlineBoxMarkerStyle);
      offlineBoxSource.addFeature(iconFeature);
    };

    let map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'http://mt0.google.cn/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
            attributions: '卫星图像来自<a href="http://g.cn">谷歌</a>'
          })
        }),
        new ol.layer.Vector({
          source: offlineBoxSource
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([114.48794, 30.47594]),
        zoom: 16
      })
    });

    // //绘制
    // let draw = new ol.interaction.Draw({
    //   source: offlineBoxSource,
    //   type: 'Polygon', //Point 点;LineString 线;Polygon 面;Circle 圆;None 空;
    //   freehand: false //为true时按住鼠标左键拖动绘制, 为false时点击一次加一个点
    // });
    // map.addInteraction(draw);

    let offlineBoxLonLats = [];
    map.on('click', e => {
      //注意坐标系统
      let lonLat = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
      console.debug('点击坐标:', lonLat);

      offlineBoxAddPoint(lonLat);

      offlineBoxLonLats.push(lonLat);
      if (offlineBoxLonLats.length === 2) {
        let boundingExtent = ol.extent.boundingExtent(offlineBoxLonLats);
        console.debug('边界范围:', boundingExtent);

        let polygon = ol.geom.Polygon.fromExtent(boundingExtent);
        //注意坐标系统
        polygon.transform('EPSG:4326', 'EPSG:3857');
        let feature = new ol.Feature({
          geometry: polygon
        });
        offlineBoxSource.addFeature(feature);
      }
    });
  }
};