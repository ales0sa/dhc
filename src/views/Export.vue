<template>
  <div>

      <h1> Choose exporting format </h1>

        <div class="flex justify-content-center">
 
            <div class="field">
                <button type="button" id="json" name="export" value="json"  @click="exportJson()"> JSON </button>
                
            </div> 


        </div>

 



  </div>
</template>

<script>
export default {

    methods: {
        exportJson() {
            let projects = JSON.parse(localStorage.getItem('projects'));
            if (!projects) {
                projects = [];
            }
            let data = JSON.stringify(projects);
            let blob = new Blob([data], {type: 'application/json'});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'projects.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

}
</script>

<style>

</style>