const { useEffect } = require("react")

const useGetAllPost = () =>{
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v2/post/get', {
                    method:'GET'
                })
            } catch (error) {
                console.log(error);
            }
        }
    })
}