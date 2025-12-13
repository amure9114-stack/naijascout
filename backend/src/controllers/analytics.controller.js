import prisma from '../utils/prisma.js';

export const getPlayerPerformance = async (req, res, next) => {
    try {
        const { playerId } = req.params;
        const { startDate, endDate } = req.query;

        const where = { playerId: parseInt(playerId) };
        
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const matches = await prisma.match.findMany({
            where,
            orderBy: { date: 'desc' }
        });

        // Calculate statistics
        const totalMatches = matches.length;
        const totalGoals = matches.reduce((sum, m) => sum + m.goals, 0);
        const totalAssists = matches.reduce((sum, m) => sum + m.assists, 0);
        const avgRating = totalMatches > 0 
            ? matches.reduce((sum, m) => sum + m.rating, 0) / totalMatches 
            : 0;

        // Wins, draws, losses
        const wins = matches.filter(m => m.result?.toLowerCase().includes('win')).length;
        const draws = matches.filter(m => m.result?.toLowerCase().includes('draw')).length;
        const losses = totalMatches - wins - draws;

        // Recent form (last 5 matches)
        const recentMatches = matches.slice(0, 5);
        const recentGoals = recentMatches.reduce((sum, m) => sum + m.goals, 0);
        const recentAssists = recentMatches.reduce((sum, m) => sum + m.assists, 0);
        const recentAvgRating = recentMatches.length > 0
            ? recentMatches.reduce((sum, m) => sum + m.rating, 0) / recentMatches.length
            : 0;

        // Performance trends (last 6 matches for chart)
        const chartData = matches.slice(0, 6).reverse().map(m => ({
            date: m.date,
            goals: m.goals,
            assists: m.assists,
            rating: m.rating
        }));

        res.json({
            success: true,
            data: {
                overview: {
                    totalMatches,
                    totalGoals,
                    totalAssists,
                    avgRating: Math.round(avgRating * 10) / 10,
                    wins,
                    draws,
                    losses,
                    winRate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0
                },
                recent: {
                    matches: recentMatches.length,
                    goals: recentGoals,
                    assists: recentAssists,
                    avgRating: Math.round(recentAvgRating * 10) / 10
                },
                chartData,
                matches: matches.slice(0, 10) // Return last 10 matches
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getPerformanceMetrics = async (req, res, next) => {
    try {
        const { playerId } = req.params;
        const { metricType, dateRange } = req.query;

        const where = { playerId: parseInt(playerId) };
        
        // Date range filtering
        if (dateRange) {
            const now = new Date();
            let startDate = new Date();
            
            switch (dateRange) {
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'season':
                    startDate.setMonth(now.getMonth() - 6);
                    break;
                default:
                    startDate = null;
            }
            
            if (startDate) {
                where.date = { gte: startDate };
            }
        }

        const matches = await prisma.match.findMany({
            where,
            orderBy: { date: 'desc' }
        });

        // Calculate different metric types
        let metrics = [];

        if (!metricType || metricType === 'all' || metricType === 'offensive') {
            const goals = matches.reduce((sum, m) => sum + m.goals, 0);
            const assists = matches.reduce((sum, m) => sum + m.assists, 0);
            metrics.push(
                {
                    id: 1,
                    title: 'Goals Scored',
                    value: goals,
                    subtitle: dateRange ? `Last ${dateRange}` : 'This season',
                    type: 'offensive',
                    color: 'text-green-400',
                    chartData: matches.slice(0, 6).reverse().map(m => m.goals)
                },
                {
                    id: 2,
                    title: 'Assists',
                    value: assists,
                    subtitle: 'Total assists',
                    type: 'offensive',
                    color: 'text-blue-400',
                    chartData: matches.slice(0, 6).reverse().map(m => m.assists)
                }
            );
        }

        if (!metricType || metricType === 'all' || metricType === 'technical') {
            const avgRating = matches.length > 0
                ? matches.reduce((sum, m) => sum + m.rating, 0) / matches.length
                : 0;
            metrics.push({
                id: 3,
                title: 'Average Rating',
                value: `${Math.round(avgRating * 10) / 10}`,
                subtitle: 'Match performance',
                type: 'technical',
                color: 'text-purple-400',
                chartData: matches.slice(0, 6).reverse().map(m => m.rating)
            });
        }

        // Add more metrics as needed (physical, defensive, etc.)
        // These would come from player profile or additional match data

        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        next(error);
    }
};


