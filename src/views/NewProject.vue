<template>
  <div class="new-project">
    <h1>
      
      Add a new project

    </h1>

    <div class="">
      <form action="" @submit="addProject">

        <div class="flex justify-content-center" >

<div>

        <input type="text" placeholder="Project name"/>
</div>
<div>

        <input type="text" placeholder="Price Per Hour"/>
</div>
<div>

        <input type="text" placeholder="Description"/>
</div>
        </div>

        <button type="submit" value="Add Project" >Save</button>
      </form> 
    </div>
  </div>
</template>
<script>
export default {
  
  methods: {
    addProject(e) {
      // add to local storage 'projects'
      e.preventDefault();
      let projectName = e.target.elements[0].value;
      let projectPPH  = e.target.elements[1].value;
      let projectDesc = e.target.elements[2].value;
      let projects = JSON.parse(localStorage.getItem('projects'));
      if (!projects) {
        projects = [];
      }
      projects.push({
        key: projects.length + 1,
        name: projectName,
        pph: projectPPH,
        description: projectDesc,
        pauses: [],
        payments: [],
        tasks: [],
        timeElapsed: 0,
        
      });
      localStorage.setItem('projects', JSON.stringify(projects));
      this.$emit('addProject', projects);

      this.$router.push('/');


 
    }

  //   // save the new project to the database
  //   addProject(project) {
  //     this.$http.post('/api/projects', project)
  //       .then(response => {
  //         this.projects.push(response.body);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   }
 }

}
</script>