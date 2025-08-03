<template>
    <div class="main">
        <h1 style="color: white;">{{ pageName }}</h1>
        <div class="user-box">
            <img height="24px" src="../assets/icons/user.png" alt="">
            <p style="color: gray;">{{ userName }}</p>
        </div>
    </div>
</template>

<script>
export default {
  props: ['pageName', 'userName']
}
</script>

<style scoped>

.main{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px 120px;
}

.user-box{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background-color: #272228;
    min-width: 120px;
    padding: 0px 20px;
    border-radius: 20px;
}

</style>