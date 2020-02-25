var firebaseConfig = {
    apiKey: "AIzaSyAMYwQxbm3BSCI6Hqs1t0LsxamINytUwDE",
    authDomain: "ehealth-961ed.firebaseapp.com",
    databaseURL: "https://ehealth-961ed.firebaseio.com",
    projectId: "ehealth-961ed",
    storageBucket: "ehealth-961ed.appspot.com",
    messagingSenderId: "295913617194",
    appId: "1:295913617194:web:fd5186a31ebca987455053",
    measurementId: "G-HBXJB9R35J"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();


var app = new Vue({
    el: '#app',
    data: {
      
      
      
        data: [],
        title: 'Blood Group',

        bloodGroups: ['A', 'B', 'O', 'AB'],
        dataSetNp: [0, 0, 0, 0],
        dataAgeRange1: [0, 0, 0, 0],
        dataAgeRange2: [0, 0, 0, 0],

    },
    methods: {
        charts() {
            var myChart = Highcharts.chart('container', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: this.title
                },
                xAxis: {
                    categories: [...this.bloodGroups],
                },
                yAxis: {
                    title: {
                        text: 'Number Of Persons'
                    }
                },
                series: [{
                    name: 'number of person per bloodGroup',
                    data: [...this.dataSetNp]
                }, {
                    name: '10 - 20(age)',
                    data: [...this.dataAgeRange1]
                }, {
                    name: '21 - 30(age)',
                    data: [...this.dataAgeRange2]
                }]
            });

        },


        dataSeter() {

            this.bloodGroups.forEach(bG => {

                let index = (bG == 'A') ? 0 : (bG == 'B') ? 1 : (bG == 'O') ? 2 : (bG == 'AB') ?
                    3 : '';



                this.data.forEach(person => {

                    if (person.bloodGroup == bG) {

                        this.dataSetNp[index]++;
                        

                        if (person.age > 10 && person.age <= 20) {
                            this.dataAgeRange1[index]++
                        }
                        if (person.age > 20 && person.age <= 30) {
                            this.dataAgeRange2[index]++
                        }
                    }
                });



            });


        },
        getData() {
            //get data from firebase

            db.collection("persons").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
     
                        this.data.push(doc.data());

                    });
                })
                .then(() => {
                    // storing data using local = storage
                    localStorage.setItem("data", JSON.stringify(this.data));
                    this.dataSeter();
                    this.charts()
                });




            if (!window.navigator.onLine) {
                // accessing data when no internet
                this.data = JSON.parse(window.localStorage.data);
                this.dataSeter();
                this.charts();
            }

        },
        loop(){     

            //function to gernerate 100 sample data

            for (let index = 0; index <= 100; index++) {
                
               let  nameArray = ['John','Jane','Jack','Kelvin','Anthony','Favour','James','Daniel','slivia','sarah','peter','paul','emma','josephine','praise','joshue','simon','king'];
                
               let dataAge = Math.floor(Math.random() * Math.floor(30));   
               let dataName =  nameArray[Math.floor(Math.random() * nameArray.length)]
                let dataBloodGroup =  this.bloodGroups[Math.floor(Math.random() * this.bloodGroups.length)]

                db.collection('persons').add({
                    name: dataName,
                    age: dataAge,
                    bloodGroup:dataBloodGroup                })
            }
        }       


    },

    created() {
        this.getData();
    //    this.loop(); 
    },
});
