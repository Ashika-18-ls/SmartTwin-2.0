VSS.sendToGateway = async function(payload){

    try{

        const response = await fetch("http://RASPBERRY_PI_IP:8000/sensor-data",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(payload)

        });

        return await response.json();

    }

    catch(error){

        console.error(error);

    }

}