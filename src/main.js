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
                        text: 'Fruit eaten'
                    }
                },
                series: [{
                    name: 'number of person',
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
                        // doc.data() is never undefined for query doc snapshots
                       
                        this.data.push(doc.data());

                    });
                })
                .then(() => {
                    localStorage.setItem("data", JSON.stringify(this.data));
                    this.dataSeter();
                    this.charts()
                });




            if (!window.navigator.onLine) {
                this.data = JSON.parse(window.localStorage.data);
                this.dataSeter();
                this.charts();
            }

        }

    },

    created() {
        this.getData();
        
    },
});