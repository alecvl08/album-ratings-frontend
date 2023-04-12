//This component is the scrollable ratings table for each album
const RatingsTable = ({ albumid, ratings, color1, color2, color3 }) => {
    return (
        <div className="table-container" style={{maxHeight: "150px", overflowY: "scroll"}}>
            <table className="table is-bordered is-fullwidth" style={{color: color1}}>
                <thead style={{backgroundColor: color2}}>
                    <tr>
                        <td style={{color: color1}}>Name</td>
                        <td style={{color: color1}}>Rating</td>
                    </tr>
                </thead>
                <tbody style={{backgroundColor: color3}}>
                    {
                        ratings.map(
                            rating => (
                                <tr key={albumid + ' ' + rating.personname}>
                                    <td>{rating.personname}</td>
                                    <td>{rating.rating}</td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default RatingsTable