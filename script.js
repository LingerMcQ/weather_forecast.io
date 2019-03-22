document.addEventListener('DOMContentLoaded', function(e) {

    function makeRequest(cb) {
        const clientId = "CWB-DD3BB3B0-AD08-4F6A-806D-6B8E849F2B5E";
        const dataid = "F-D0047-091";
        // "F-C0032-001"：一般天氣預報-今明 36 小時天氣預：;
        // "F-D0047-091"：鄉鎮天氣預報-臺灣未來一週天氣預報
        const format = "JSON";

        const apiUrl = `https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/${dataid}?Authorization=${clientId}&format=${format}`
        // https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-D0047-091?Authorization=CWB-DD3BB3B0-AD08-4F6A-806D-6B8E849F2B5E&format=JSON



        httpRequest = new XMLHttpRequest();

        httpRequest.open('GET', apiUrl, true);
        httpRequest.send();

        httpRequest.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200) {
                var data = JSON.parse(this.responseText);
                // console.log(data);
                cb(data);
            } 
        }
    }
    // makeRequest((err, data) => {
    //     const {info} = data;
    // });
    makeRequest(getData__Taipei);




    function getData__Taipei(data) {

        // top 的變數
        // obj = 主要資料起點
        const locations = data.cwbopendata.dataset.locations;
        // obj = 台北的資料
        const location__Taipei = locations.location[16];
        // 今天時間
        const dateToday = data.cwbopendata.dataset.datasetInfo.validTime.startTime.substr(5, 5);
        // 台北 str
        const site = location__Taipei.locationName;
        // 天氣種類
        const typeOfWeather = location__Taipei.weatherElement[12].time[0].elementValue[0].value;
        // 溫度相關
        const temperatureAverage = location__Taipei.weatherElement[0].time[0].elementValue.value;
        const temperatureMin = location__Taipei.weatherElement[4].time[0].elementValue.value;
        const temperatureMax = location__Taipei.weatherElement[3].time[0].elementValue.value;
        // 降雨機率
        const RainProb = location__Taipei.weatherElement[9].time[0].elementValue.value;

        function weekDay(n) {
            let arrDays = Array(7);

            let today = new Date();
            let weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";

            arrDays[0] = weekday[today.getDay()];
            for(j=1; j<=6; j++) {
                let dayNum = today.getDay() + j
                if (dayNum > 6) {
                    dayNum = dayNum - 7;
                }
                arrDays[j] = weekday[dayNum];
            }
            return arrDays[n]
        }


        // bottom 的變數
        // str 第 n 天的日期
        function Future__DateStr(n) {
            let i = 2*n-1
            let originTime =  location__Taipei.weatherElement[0].time[i].startTime;
            return originTime.substr(5, 5);
        }
        function Future__temperatureAverage(n){
            let i = 2*n-1
            return location__Taipei.weatherElement[0].time[i].elementValue.value;
        }
        function Future__temperatureMin(n){
            let i = 2*n-1
            return location__Taipei.weatherElement[4].time[i].elementValue.value;
        }
        function Future__temperatureMax(n){
            let i = 2*n-1
            return location__Taipei.weatherElement[3].time[i].elementValue.value;
        }
        function Future__rainProb(n){
            let i = 2*n-1
            return location__Taipei.weatherElement[9].time[i].elementValue.value;
        }

        // top 
        document.querySelector('.top__dateToday').innerHTML = dateToday.substr(0,2) + '/' + dateToday.substr(3,2);
        document.querySelector('.top__weekDay').innerHTML = weekDay(0);
        document.querySelector('.top__site').innerHTML = site + ' Taipei';
        document.querySelector('.top__typeOfWeather').innerHTML = typeOfWeather;
        document.querySelector('.top__temperatureAverage').innerHTML = temperatureAverage + '°C';
        document.querySelector('.top__temperatureMinToMax').innerHTML = temperatureMin + '°C' + ' - ' + temperatureMax + '°C';
        document.querySelector('.top__RainfallProb').innerHTML = RainProb + '%';


        // bottom
        futureDataUpdate();
        function futureDataUpdate() {
            for(i=1; i<=6; i++) {
                let className = '.day'+ i
                document.querySelector( className + ' > .bottom__weekDay').innerHTML = Future__DateStr(i).substr(0,2) + '/' + Future__DateStr(i).substr(3,2);
                document.querySelector( className + ' > .bottom__date').innerHTML = weekDay(i).substr(0,3) + '.';
                document.querySelector( className + ' > .bottom__temperatureAverage').innerHTML = Future__temperatureAverage(i) + '°C';
                document.querySelector( className + ' > .bottom__RainfallProb').innerHTML = function(i){
                    if(!Future__rainProb(i)) {
                        return '';
                    }
                    return Future__rainProb(i) + '%';
                }(i);
            }
        };


    }



    function test() {
                    

        // obj = 主要資料起點
        const locations = data.cwbopendata.dataset.locations
        // obj = 台北的資料
        const location__Taipei = locations.location[16];

        
        // str = 臺灣各縣市鄉鎮未來1週逐12小時天氣預報
        console.log(data.cwbopendata.dataset.datasetInfo.datasetDescription);
        // str = 開始時間
        console.log(data.cwbopendata.dataset.datasetInfo.validTime.startTime);


        // str = 台灣
        console.log(locations.locationsName);
        // arr = 各地區資料
        console.log(locations.location);

        // 0: {locationName: "連江縣", geocode: "09007", lat: "26.154204", lon: "119.929303", weatherElement: Array(15)}
        // 1: {locationName: "金門縣", geocode: "09020", lat: "24.434365", lon: "118.312425", weatherElement: Array(15)}
        // 2: {locationName: "宜蘭縣", geocode: "10002", lat: "24.753707", lon: "121.745083", weatherElement: Array(15)}
        // 3: {locationName: "新竹縣", geocode: "10004", lat: "24.841245", lon: "120.995698", weatherElement: Array(15)}
        // 4: {locationName: "苗栗縣", geocode: "10005", lat: "24.563327", lon: "120.81097", weatherElement: Array(15)}
        // 5: {locationName: "彰化縣", geocode: "10007", lat: "24.082575", lon: "120.534059", weatherElement: Array(15)}
        // 6: {locationName: "南投縣", geocode: "10008", lat: "23.913301", lon: "120.679244", weatherElement: Array(15)}
        // 7: {locationName: "雲林縣", geocode: "10009", lat: "23.698834", lon: "120.518874", weatherElement: Array(15)}
        // 8: {locationName: "嘉義縣", geocode: "10010", lat: "23.460227", lon: "120.323988", weatherElement: Array(15)}
        // 9: {locationName: "屏東縣", geocode: "10013", lat: "22.664236", lon: "120.483389", weatherElement: Array(15)}
        // 10: {locationName: "臺東縣", geocode: "10014", lat: "22.756487", lon: "121.138672", weatherElement: Array(15)}
        // 11: {locationName: "花蓮縣", geocode: "10015", lat: "23.983897", lon: "121.598641", weatherElement: Array(15)}
        // 12: {locationName: "澎湖縣", geocode: "10016", lat: "23.567554", lon: "119.570666", weatherElement: Array(15)}
        // 13: {locationName: "基隆市", geocode: "10017", lat: "25.153191", lon: "121.759355", weatherElement: Array(15)}
        // 14: {locationName: "新竹市", geocode: "10018", lat: "24.818109", lon: "120.96211", weatherElement: Array(15)}
        // 15: {locationName: "嘉義市", geocode: "10020", lat: "23.480384", lon: "120.445361", weatherElement: Array(15)}
        // 16: {locationName: "臺北市", geocode: "63", lat: "25.035095", lon: "121.558742", weatherElement: Array(15)}
        // 17: {locationName: "高雄市", geocode: "64", lat: "22.623511", lon: "120.304085", weatherElement: Array(15)}
        // 18: {locationName: "新北市", geocode: "65", lat: "25.01154", lon: "121.450888", weatherElement: Array(15)}
        // 19: {locationName: "臺中市", geocode: "66", lat: "24.142918", lon: "120.66295", weatherElement: Array(15)}
        // 20: {locationName: "臺南市", geocode: "67", lat: "22.996394", lon: "120.160419", weatherElement: Array(15)}
        // 21: {locationName: "桃園市", geocode: "68", lat: "24.99572", lon: "121.293452", weatherElement: Array(15)}
        // length: 22



    
        // 特定縣市的天氣資訊 跑出地點
        console.log('locationName: ' + location__Taipei.locationName);
        // arr=  特定縣市的天氣資訊
        console.log(location__Taipei.weatherElement);
            // 0: {elementName: "T", description: "平均溫度", time: Array(15)}
            // 1: {elementName: "Td", description: "平均露點溫度", time: Array(15)}
            // 2: {elementName: "RH", description: "平均相對濕度", time: Array(15)}
            // 3: {elementName: "MaxT", description: "最高溫度", time: Array(15)}
            // 4: {elementName: "MinT", description: "最低溫度", time: Array(15)}
            // 5: {elementName: "MaxAT", description: "最高體感溫度", time: Array(15)}
            // 6: {elementName: "MinAT", description: "最低體感溫度", time: Array(15)}
            // 7: {elementName: "MaxCI", description: "最大舒適度指數", time: Array(15)}
            // 8: {elementName: "MinCI", description: "最小舒適度指數", time: Array(15)}
            // 9: {elementName: "PoP12h", description: "12小時降雨機率", time: Array(15)}
            // 10: {elementName: "WD", description: "風向", time: Array(15)}
            // 11: {elementName: "WS", description: "最大風速", time: Array(15)}
            // 12: {elementName: "Wx", description: "天氣現象", time: Array(15)}
            // 13: {elementName: "UVI", description: "紫外獻指數", time: Array(7)}
            // 14: {elementName: "WeatherDescription", description: "天氣預報綜合描述", time: Array(15)}


        // obj = 特定縣市的天氣資訊_平均溫度資訊
        console.log(location__Taipei.weatherElement[0]);
        // str "平均溫度"
        console.log(location__Taipei.weatherElement[0].description);

        // arr "平均溫度" 七天日夜資訊
        console.log(location__Taipei.weatherElement[0].time);
        // obj = "平均溫度" 第一天早上的資料
        console.log(location__Taipei.weatherElement[0].time[0]);
        // obj = "平均溫度" 第一天早上的資料：開始時間
        // print 每天資訊
        console.log(location__Taipei.weatherElement[0].time[0].startTime);


        // 攝氏溫度的值
        console.log('攝氏溫度： ' + location__Taipei.weatherElement[0].time[0].elementValue.value);





        // 0: {locationName: "連江縣", geocode: "09007", lat: "26.154204", lon: "119.929303", weatherElement: Array(15)}
        // 1: {locationName: "金門縣", geocode: "09020", lat: "24.434365", lon: "118.312425", weatherElement: Array(15)}
        // 2: {locationName: "宜蘭縣", geocode: "10002", lat: "24.753707", lon: "121.745083", weatherElement: Array(15)}
        // 3: {locationName: "新竹縣", geocode: "10004", lat: "24.841245", lon: "120.995698", weatherElement: Array(15)}
        // 4: {locationName: "苗栗縣", geocode: "10005", lat: "24.563327", lon: "120.81097", weatherElement: Array(15)}
        // 5: {locationName: "彰化縣", geocode: "10007", lat: "24.082575", lon: "120.534059", weatherElement: Array(15)}
        // 6: {locationName: "南投縣", geocode: "10008", lat: "23.913301", lon: "120.679244", weatherElement: Array(15)}
        // 7: {locationName: "雲林縣", geocode: "10009", lat: "23.698834", lon: "120.518874", weatherElement: Array(15)}
        // 8: {locationName: "嘉義縣", geocode: "10010", lat: "23.460227", lon: "120.323988", weatherElement: Array(15)}
        // 9: {locationName: "屏東縣", geocode: "10013", lat: "22.664236", lon: "120.483389", weatherElement: Array(15)}
        // 10: {locationName: "臺東縣", geocode: "10014", lat: "22.756487", lon: "121.138672", weatherElement: Array(15)}
        // 11: {locationName: "花蓮縣", geocode: "10015", lat: "23.983897", lon: "121.598641", weatherElement: Array(15)}
        // 12: {locationName: "澎湖縣", geocode: "10016", lat: "23.567554", lon: "119.570666", weatherElement: Array(15)}
        // 13: {locationName: "基隆市", geocode: "10017", lat: "25.153191", lon: "121.759355", weatherElement: Array(15)}
        // 14: {locationName: "新竹市", geocode: "10018", lat: "24.818109", lon: "120.96211", weatherElement: Array(15)}
        // 15: {locationName: "嘉義市", geocode: "10020", lat: "23.480384", lon: "120.445361", weatherElement: Array(15)}
        // 16: {locationName: "臺北市", geocode: "63", lat: "25.035095", lon: "121.558742", weatherElement: Array(15)}
        // 17: {locationName: "高雄市", geocode: "64", lat: "22.623511", lon: "120.304085", weatherElement: Array(15)}
        // 18: {locationName: "新北市", geocode: "65", lat: "25.01154", lon: "121.450888", weatherElement: Array(15)}
        // 19: {locationName: "臺中市", geocode: "66", lat: "24.142918", lon: "120.66295", weatherElement: Array(15)}
        // 20: {locationName: "臺南市", geocode: "67", lat: "22.996394", lon: "120.160419", weatherElement: Array(15)}
        // 21: {locationName: "桃園市", geocode: "68", lat: "24.99572", lon: "121.293452", weatherElement: Array(15)}

        // cb(null, response);
        // 記得參數要放 cb





    }






});