import React, {useState, useEffect} from "react";
import DisplayStatus from "./DisplayStatus";

function MainSection(){
    const [randomFlavors,setRandomFlavors] = useState([]);
    const [randomReviews,setRandomReviews] = useState([]);
    const [status, setStatus] = useState("");

    useEffect(()=>{
    const fetchData = async () => {
        try {
            const flavorResponse = await fetch("http://127.0.0.1:5000/flavors");
            const flavorData = await flavorResponse.json();
            if (flavorResponse.ok && flavorData.flavors){
                const shuffledFlavors = [... flavorData.flavors].sort(
                    () => 0.5 - Math.random()
                );
                setRandomFlavors(shuffledFlavors.slice(0, 3));
            } else{
                setStatus({
                    type: "error",
                    message: "Could not load flavors..."
                });
            }

            const reviewsResponse = await fetch("http://127.0.0.1:5000/reviews");
            const reviewData = await reviewsResponse.json();
            if (reviewsResponse.ok && reviewData.reviews){
                setRandomReviews(reviewData.reviews);
            } else{
                setStatus({
                    type: "error",
                    message: "Could not load reviews..."
                });
            }
        }  catch (err){
            setStatus({
                type: "error",
                message: "Could not connect to the backend..."
            });
        } 
    };
    fetchData();
    }, [])

    return(
        <div className="main-section">
            <h2>About Sweet Scoop</h2>
            <p className="about-text">
                Sweet Scoop offers a variety of delicious ice cream flavors made from fresh ingredients.
            </p>

            {status && <DisplayStatus type={status.type} message={status.message} />}

            <h2>Featured Flavors</h2>

            <div className="featured-flavors">

                {randomFlavors.map(f=>(
                    <div className="flavor-card" key={f.id}>
                        <h4>{f.name}</h4>
                        <img src = {f.image}/>
                        <p>{f.price}</p>
                    </div>
                ))}
            </div>

            <h2>Customer Reviews</h2>
            <div className="reviews">
            {randomReviews.map((r,i)=>(
            <div  key={i}>
                <h4>{r.customerName}</h4>
                <p>{r.review}</p>
                <p>{"★".repeat(r.rating)}</p>
            </div>
            ))}

            </div>

        </div>

    )

}

export default MainSection;