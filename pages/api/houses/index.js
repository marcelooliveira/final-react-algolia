import { client, q } from '../../../config/db'

export default async (req, res) => {

    client
    .query(
    q.Paginate(
        q.Match(
        q.Ref('indexes/houses')))
    )
    .then((response) => {
        const refs = response.data

        const getAllDataQuery = refs.map((ref) => {
            return q.Get(ref)
        })
        // query the refs
        return client.query(getAllDataQuery).then((data) => {

            res.status(200).json(data);
        })
    })
    .catch((error) => console.log('error: ', res.status(500).json({ error: error.message })))
};