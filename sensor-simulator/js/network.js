VSS.sendToGateway = async function(payload){
    try{
        const response = await fetch("http://192.168.1.12:8000/sensor-data",{
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