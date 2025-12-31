import { useNavigate } from "react-router-dom";
import { usePlayers } from '../../context/PlayerContext';

function Index() {
    const navigate = useNavigate();
    const { shortlist, removeFromShortlist } = usePlayers();

    const openAnalytics = (id) => {
        navigate(`/scout/analytics/${id}`);
    };

    return (
        <div className="min-h-screen bg-black/50 p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Shortlisted Players</h1>

            {shortlist.length === 0 ? (
                <div className="text-white/80">You have no shortlisted players yet. Click "Add to shortlist" on a player to save them here.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shortlist.map((player) => (
                        <div
                            key={player.id}
                            className="cursor-pointer bg-black/20 border border-white/20 backdrop-blur-xl p-4 rounded-3xl hover:border-green-600/50 transition-all duration-300"
                        >
                            <div onClick={() => openAnalytics(player.id)}>
                                <img
                                    src={player.image}
                                    alt={player.name}
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                />

                                <h2 className="text-xl font-semibold text-white">{player.name}</h2>
                                <p className="text-white/60">{player.position}</p>

                                <div className="mt-2 flex justify-between text-sm text-white/80">
                                    <span>Age: {player.age}</span>
                                    <span className="text-green-400 font-bold">Rating: {player.rating ?? '—'}</span>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button onClick={() => openAnalytics(player.id)} className="px-3 py-2 bg-primary rounded text-white">View</button>
                                <button onClick={() => removeFromShortlist(player.id)} className="px-3 py-2 bg-destructive rounded text-white">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Index;
