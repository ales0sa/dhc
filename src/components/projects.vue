<template>
  <div class="project-grid">
    <router-link
      v-for="project in projects"
      class="project"
      :key="project.key"
      :to="'/p' + project.key"
    >
      <div class="project-header">
        <h2>{{ project.name }}</h2>
        <p>{{ project.description }}</p>
      </div>
      <div class="project-body">

        Worked Time:  {{  secsParsed(workedHours(project)) }}
        Pending Payments: $ {{  formatMoney(pendingPayments(project)) }}
        Earned: $ {{  formatMoney(earned(project)) }}

      </div>
    </router-link>
    <router-link to="/new-project">
      <div class="project project-new">
        <div class="project-header">
          <h2>+ New Project</h2>
          <p>Add a new project</p>
        </div>
        <div class="project-body">
          Set the price per hour, and others details...
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['devTools'],
  data() {
    return {
      projects: [],
    };
  },
  methods: {
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
    workedHours(project) {
      let workedHours = 0;
      if (project.pauses) {
        workedHours = project.pauses.reduce((acc, pause) => {
          return acc + pause.workedTime;
        }, 0);
      }
      return workedHours;
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
    earned(project) {
      let earned = 0;
      if (project.payments) {
        earned = project.payments.reduce((acc, payment) => {
          return acc + payment.amount;
        }, 0);
      }
      return earned;
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

  },
  computed: {},
  mounted() {},
  created() {
    // get projects from local storage
    let projects = JSON.parse(localStorage.getItem("projects"));

    // if there are projects in local storage
    if (projects) {
      // add them to the projects array
      this.projects = projects;

      // and save them to local storage
      localStorage.setItem("projects", JSON.stringify(projects));
    } else {
      // if there are no projects in local storage
      // save the projects array to local storage
      //localStorage.setItem("projects", JSON.stringify(this.projects));
    }
  },
};
</script>


<style lang="scss">
  button {
    background-color: #3d3fc441;
    border: 1px solid #ccc;
    border-radius: 25px;
    padding: 10px;
    margin-top: 10px;
    color: #fff;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: white;
      color: #3d3fc4;
    }
  }

.project {
  margin: 20px;
  padding: 20px;
  border: 1px solid #4289b9;
  border-radius: 25px;
  background-color: #4289b963;
  box-shadow: 0 0 3px #3d3fc4;
  &-active {
    background-color: #7070a76b;

    padding: 30px;
  }
  &-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
  }
  &:hover {
      background-color: #3d40c4;
      color: white;
  }

  &-new {
    margin: 20px;
    padding: 20px;
    border: 1px solid #24853c;
    border-radius: 25px;
    background-color: #5eda7d85;

    &:hover {
      background-color: #24853c;
      color: white;
    }
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>