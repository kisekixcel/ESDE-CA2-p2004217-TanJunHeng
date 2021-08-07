let $profileContainer = $('#profileContainer');
if ($profileContainer.length != 0) {
    console.log('Profile page is detected. Binding event handling logic to form elements.');
    $('#backButton').on("click", function(e){
        e.preventDefault();
        window.history.back();
    });

    function getOneUser() {

        const baseUrl = 'https://3.92.106.130:5000';

        let userId = sessionStorage.getItem('user_id');
        let token = sessionStorage.getItem('token')
        axios({
            headers: {
             'user': userId,
             'authorization': 'Bearer ' + token
            },
            method: 'get',
            url: 'https://y2d1tebz53.execute-api.us-east-1.amazonaws.com/test/getprofile',
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically populate the elements with data.
                console.dir(response.data);
                const record = response.data.userdata[0];
                if (window.location.href == "https://localhost:3001/admin/profile.html") {
                    if (response.data.userdata.role_name == 'user') {
                        window.location.href = "https://localhost:3001/user/profile.html"
                    }
                }
                $('#fullNameOutput').text(record.fullname);
                $('#emailOutput').text(record.email);
            })
            .catch(function(error) {
                //Handle error
                console.dir(error);
                new Noty({
                    type: 'error',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: error.response.data.message,
                }).show();
            });

    } //End of getOneUser
    //Call getOneUser function to do a GET HTTP request on an API to retrieve one user record
    getOneUser();
} //End of checking for $profileContainer jQuery object

