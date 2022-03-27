<template>
  <div class="project-active">


      <div class="grid">
          <div class="col">
                  <div>
      <!-- <button @click="play()">  START </button>
            <button @click="pause()"> PAUSE </button>
            <button @click="stop()">  STOP </button> -->
    <button class="btn play"  v-if=" this.paused" @click="play()">  START </button>
      <button  class="btn pause" v-if="!this.paused" @click="pause()">  PAUSE </button>
    </div>



    <div>
      <h2>
        {{ secsParsed(timeelapsed) }} 
        
        <!-- ( $ {{ ((timeelapsed / 60) * (project.pph / 60)).toFixed(2) }} ) -->
      </h2>
<div v-if="!devTools ">

        <button @click="timespeed = timespeed / 2"> - </button>
        SPEED <span>x{{ timespeed }}</span>
      <button @click="timespeed = timespeed * 2"> + </button>
</div>
    </div>


    <h1>{{ project.name }}</h1>
<div class="grid">
<div class="col-6">
    <table>
        <tr>
            <td>Price Per Hour</td>
            <td>$ {{ formatMoney(project.pph) }}</td>
        </tr>
        <tr>
            <td>Description</td>
            <td>{{ project.description }}</td>
        </tr>
    </table>
</div>
<div class="col-6">
    <table>
        <tr>
            <td>Total Worked Hours</td>
            <td>{{ secsParsed(oldtimeelapsed) }}</td>
        </tr>
        
        <tr>
            <td>Payments received </td>
            <td v-if="payments() >= 1"> $ {{ formatMoney(payments()) }} </td>
        </tr>
                <tr>
            <td>Total To Collect </td>
            <td v-if="payments() >= 1">$ 
                
                <!-- {{ formatMoney(((((timeelapsed / 60 + oldtimeelapsed / 60) * (project.pph / 60)).toFixed(2)) - payments()).toFixed(2))}} -->
                {{  formatMoney(pendingPayments(project)) }}
                </td>
        </tr>
    </table>
</div>
<div class="col-4">

</div>


    <button class="danger-btn" @click="deleteProject">Delete Project</button>
</div>

          </div>
          <div class="col w-full">

              <div class="">
                      <table>
        <tr>
            <td><input type="number" v-model="newPay"
                 
                 /> </td>
            <td >

                 
            
            <button @click="addPay()" class="pay" :disabled="newPay === 0">Add Payment</button> 

            </td>
            
        </tr>
    </table>
    
    <table class="mt-2">
        <tr v-for="(payment, index) in project.payments" :key="index">
            <td>{{ formatDate(payment.date) }}</td>
            <td>$ {{ formatMoney(payment.amount) }}</td>
            </tr>
                
    </table>
              </div>
          </div>
      </div>


    <div v-if="taskVisible == true">
      <h2>TASKS</h2>
      <div v-for="task in project.tasks" :key="task.key">
        <div>
          {{ task.name }}
        </div>
        <div>
          {{ task.description }}
        </div>
      </div>
    </div>




  </div>
</template>

<script>
export default {
    props: ['devTools'],
  data() {
    return {
      newPay: 0,
      project: [],
      timeelapsed: 0,
      oldtimeelapsed: 0,
      paused: true,
      taskVisible: false,
      interval: null,
      timespeed: 1,
    };
  },
  methods: {
      deleteProject() {
        let projects = JSON.parse(localStorage.getItem('projects'));
        projects.splice(this.project.key - 1, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        this.$emit('deleteProject', projects);

        this.$router.push('/');
      },
      payments() {
        let payments = 0;
        if(this.project && this.project.payments) {
          this.project.payments.forEach(p => {
              // string to number
                payments += parseInt(p.amount);
            
          });
        }
        return payments;
      },
    play() {

        this.paused = false;
    clearInterval(this.interval)

    this.interval = setInterval(() => {
      if (!this.paused) {
        this.timeelapsed = this.timeelapsed + this.timespeed;
      }
    }, 1000);

    },
    addPay() {
              if(!this.project.payments) {
        this.project.payments = [];
      }

      this.project.payments.push({"amount": this.newPay, date: new Date()});
      this.newPay = 0;

      // update local

      let projects = JSON.parse(localStorage.getItem("projects"));
      projects[this.project.key - 1] = this.project;
      localStorage.setItem("projects", JSON.stringify(projects));

    },
        pendingPayments(project) {
      let payments = 0;
      if(project && project.pauses) {
        project.pauses.forEach(p => {
          //payments += parseInt(p.workedTime * 60) / parseInt(project.pph / 60);
          payments += parseInt(p.workedTime / 60) / 60  *  parseInt(project.pph );
        });
      }

      if(project && project.payments) {
        project.payments.forEach(p => {
          payments -= parseInt(p.amount)
        });
      }

      return payments;
    },
    pause() {
      // add a pause array to the project

      if(!this.project.pauses) {
        this.project.pauses = [];
      }

      this.project.pauses.push({
        workedTime: this.timeelapsed,
        date: new Date(),
      });

      let projects = JSON.parse(localStorage.getItem("projects"));
      projects[this.project.key - 1] = this.project;
      localStorage.setItem("projects", JSON.stringify(projects));

      this.paused = true;
      //window.location.href = "/";
            this.oldtimeelapsed = this.project.pauses.reduce((acc, pause) => {
        return acc + pause.workedTime;
      }, 0);

      this.timeelapsed = 0;

    },
    stop() {
      this.project.endDate = new Date();
    },

    secsParsed: function (sec) {
      var hours = Math.floor(sec / 3600);
      hours >= 1 ? (sec = sec - hours * 3600) : (hours = "00");
      var min = Math.floor(sec / 60);
      min >= 1 ? (sec = sec - min * 60) : (min = "00");
      sec < 1 ? (sec = "00") : void 0;

      let ph = "00";
      if (hours >= 1) {
        ph = String(hours).padStart(2, "0");
      }
      let sec2 = "00";
      if (sec >= 1) {
        sec2 = String(sec).padStart(2, "0");
      }

      min.toString().length == 1 ? (min = "0" + min) : void 0;

      return ph + ":" + min + ":" + sec2;
    },
    formatMoney: function (amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
          negativeSign +
          (j ? i.substr(0, j) + thousands : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
          (decimalCount
            ? decimal +
              Math.abs(amount - i)
                .toFixed(decimalCount)
                .slice(2)
            : "")
        );
      } catch (e) {
        console.log(e);
      }
    },
    formatDate: function (date) {

        
        //check date type
        if (typeof date === "string") {
            date = new Date(date);
        }
        
        //get date parts
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // pad left zeros
        const pad = (num) => {
            return num < 10 ? "0" + num : num;
        }
        //return formatted date
        return `${day}/${pad(month)}/${year} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    },
  },
  computed: {},

  mounted() {
    // count time elapsed


  },
  created() {
    // get projects from local storage
    let projects = JSON.parse(localStorage.getItem("projects"));

    // find key by router id
    let key = this.$route.params.id;

    // if there are projects in local storage
    if (projects) {
      // add them to the projects array
      let p = projects.find((project) => project.key == key);

      // if no p payments
        if (p && !p.payments) {
            p.payments = [];
        }

      // parse to object
      this.project = JSON.parse(JSON.stringify(p));

      // set timeelapsed to the time elapsed of the project
      this.oldtimeelapsed = this.project.pauses.reduce((acc, pause) => {
        return acc + pause.workedTime;
      }, 0);
    }
  },
};
</script>

<style lang="scss">

table {
    background: white;
    padding: 20px;
    border-radius: 30px;
}
table td {
  
  width: 200px;
}
table tr > td:nth-child(1) {
  text-align: left;
  font-weight: bold;

}
table tr > td:nth-child(2) {
  text-align: right;
  

}

.play {
  background-color: rgba(22, 182, 22, 0.685);
    border: 1px solid rgb(35, 114, 68);
    color: #000;
    padding: 10px 30px 10px 30px;
    font-weight: bolder;
    font-size: 18px;

}

.pause {
  background-color: rgba(255, 174, 0, 0.685);
    border: 1px solid rgb(255, 174, 0);
    color: #000;
    padding: 10px 30px 10px 30px;
    font-weight: bolder;
    font-size: 18px;

}

.pay {
    background-color: rgba(92, 98, 173, 0.685);
    border: 1px solid rgb(0, 0, 0);
    color: #000;
    padding: 10px 30px 10px 30px;
    font-weight: bolder;
    font-size: 18px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    

    
}

.danger-btn {
  background-color: #ff0000;
  color: #fff;
  border-color: #ff0000;
  opacity: 0.7;
    transition: 0.3s;
    cursor: pointer;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;

    &:hover {
      background-color: #ff0000;
      color: #fff;
      border-color: #ff0000;
      opacity: 1;
    }
}
</style>