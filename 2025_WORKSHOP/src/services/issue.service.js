import axios from 'axios';
import IssueRepository from '../repositories/issue.repository.js';

export const getAllIssues = async () => {
    return await IssueRepository.findAll();
};

export const getIssueByIssueId = async (issueId) => {
    return await IssueRepository.findByIssueId(issueId);
};

export const fetchGithubIssues = async (repoOwner, repoName) => {
    // poner async si va a tardar
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/issues?state=all`;
    const response = await fetchAllGitHubData(url);
    return response;
};
export const fetchAllGitHubData = async (url, token = null) => {
    let allData = [];
    let nextUrl = url;
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Node-JS-App'
    };
    if (token) headers['Authorization'] = `token ${token}`;

    try {
        while (nextUrl) {
            const response = await axios.get(nextUrl, { headers });

            allData = allData.concat(response.data);

            const linkHeader = response.headers.link;
            nextUrl = getNextPageUrl(linkHeader);
        }

        return allData;
    } catch (error) {
        console.error("Error en fetchAllGitHubData:", error.response?.data || error.message);
        throw error;
    }
};
const getNextPageUrl = (linkHeader) => {
    if (!linkHeader) return null;
    const links = linkHeader.split(',');
    const nextLink = links.find(link => link.includes('rel="next"'));
    if (!nextLink) return null;
    return nextLink.match(/<(.*)>/)[1];
};
export const saveIssues = async (issues) => {
    const savedIssues = [];
    for (const issueData of issues) {
        const existingIssue = await IssueRepository.findByIssueId(issueData.id);
        if (!existingIssue) {
            const newIssue = {
                issueId: issueData.id,
                number: issueData.number,
                title: issueData.title,
                body: issueData.body,
                url: issueData.html_url,
                state: issueData.state,
                createdAt: issueData.created_at,
                updateAt: issueData.updated_at,
            };
            savedIssues.push(await IssueRepository.create(newIssue));
        } else {
            savedIssues.push(existingIssue);
        }
    };
    return savedIssues;
};

export default {
    getAllIssues,
    getIssueByIssueId,
    fetchGithubIssues,
    saveIssues
};