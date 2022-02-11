import { google } from 'googleapis';

const pageViewsAPI = async (req, res) => {
    const startDate = req.query.startDate || '2022-01-01'
    const post = req.query.post;
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_CLIENT_ID,
                private_key: process.env.GOOGLE_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        })

        const analytics = google.analytics({
            auth,
            version: 'v3',
        })

        const response = await analytics.data.ga.get({
            ids: `ga:${process.env.GOOGLE_ANALYTICS_VIEW_ID}`,
            metrics: 'ga:pageviews',
            dimensions: 'ga:pagePath',
            ...(post ? { filters: `ga:pagePath==${post}` } : {}),
            'start-date': startDate,
            'end-date': 'today',
        })

        const pageViews = response?.data?.totalsForAllResults['ga:pageviews']
        let pageViewsCount = res.status(200).json({
            pageViews,
        })
        return pageViewsCount;
    } catch (err) {
        console.log("Error when integrate google analytics:", err);
        return res.status(500).json({ error: err.message })
    }
}

export default pageViewsAPI