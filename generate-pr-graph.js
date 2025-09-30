/**
 * PR Contribution Graph Generator
 * 
 * This script fetches PR data from GitHub and generates a contribution graph
 * showing PR activity over time.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  githubUsername: 'dongowu', // Your GitHub username
  outputPath: path.join(__dirname, 'pr-contribution-graph.svg'),
  months: 12, // Number of months to include in the graph
  includePrivate: false, // Whether to include private repositories (requires authentication)
};

/**
 * Fetches PRs from GitHub API for a specific user
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} - Array of PR objects
 */
function fetchUserPRs(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/search/issues?q=author:${username}+type:pr+is:public&per_page=100&sort=created&order=desc`,
      method: 'GET',
      headers: {
        'User-Agent': 'PR-Graph-Generator',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode !== 200) {
            reject(new Error(`GitHub API Error: ${parsedData.message}`));
            return;
          }
          resolve(parsedData.items || []);
        } catch (error) {
          reject(new Error(`Failed to parse GitHub API response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    req.end();
  });
}

/**
 * Organizes PR data by month and repository
 * @param {Array} prs - Array of PR objects
 * @returns {Object} - Organized PR data
 */
function organizePRData(prs) {
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(now.getMonth() - config.months + 1);
  startDate.setDate(1);
  
  // Initialize data structure with months
  const monthlyData = {};
  for (let i = 0; i < config.months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = {
      count: 0,
      repositories: {}
    };
  }
  
  // Organize PR data
  prs.forEach(pr => {
    const createdDate = new Date(pr.created_at);
    const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].count++;
      
      // Extract repository name from repository_url
      const repoName = pr.repository_url.replace('https://api.github.com/repos/', '');
      
      if (!monthlyData[monthKey].repositories[repoName]) {
        monthlyData[monthKey].repositories[repoName] = 1;
      } else {
        monthlyData[monthKey].repositories[repoName]++;
      }
    }
  });
  
  return monthlyData;
}

/**
 * Generates SVG graph from PR data
 * @param {Object} monthlyData - Organized PR data
 * @returns {string} - SVG content
 */
function generateSVGGraph(monthlyData) {
  const width = 800;
  const height = 300;
  const padding = 50;
  const barWidth = (width - padding * 2) / Object.keys(monthlyData).length;
  
  // Find maximum PR count for scaling
  const maxCount = Math.max(
    5, // Minimum scale
    ...Object.values(monthlyData).map(month => month.count)
  );
  
  // Generate month labels
  const monthLabels = Object.keys(monthlyData).map((monthKey, index) => {
    const [year, month] = monthKey.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(month) - 1];
    return {
      x: padding + index * barWidth + barWidth / 2,
      label: `${monthName} ${year}`
    };
  });
  
  // Generate bars
  const bars = Object.entries(monthlyData).map(([monthKey, data], index) => {
    const barHeight = data.count > 0 ? (data.count / maxCount) * (height - padding * 2) : 0;
    return {
      x: padding + index * barWidth,
      y: height - padding - barHeight,
      width: barWidth - 2,
      height: barHeight,
      count: data.count,
      repositories: Object.entries(data.repositories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3) // Top 3 repositories
    };
  });
  
  // Generate SVG
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bar { fill: #8250df; }
    .bar:hover { fill: #a371f7; }
    .axis { stroke: #d0d7de; stroke-width: 1; }
    .label { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 12px; fill: #57606a; }
    .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #24292f; }
    .tooltip { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 12px; }
    .repo-item { font-size: 10px; }
  </style>
  
  <title>PR Contribution Graph for ${config.githubUsername}</title>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#ffffff" />
  
  <!-- Title -->
  <text x="${width / 2}" y="25" text-anchor="middle" class="title">PR Contributions (Last ${config.months} Months)</text>
  
  <!-- X-axis -->
  <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" class="axis" />
  
  <!-- Y-axis -->
  <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" class="axis" />
  
  <!-- Bars -->
  ${bars.map(bar => `
    <g>
      <rect x="${bar.x}" y="${bar.y}" width="${bar.width}" height="${bar.height}" class="bar">
        <title>
          ${bar.count} PRs
          ${bar.repositories.map(([repo, count]) => `
            &#10;${repo}: ${count} PR${count > 1 ? 's' : ''}`).join('')}
        </title>
      </rect>
      <text x="${bar.x + bar.width / 2}" y="${bar.y - 5}" text-anchor="middle" class="label">${bar.count}</text>
    </g>
  `).join('')}
  
  <!-- X-axis labels -->
  ${monthLabels.map(month => `
    <text x="${month.x}" y="${height - padding + 20}" text-anchor="middle" class="label" transform="rotate(45 ${month.x} ${height - padding + 20})">${month.label}</text>
  `).join('')}
  
  <!-- Y-axis labels -->
  <text x="${padding - 10}" y="${height - padding}" text-anchor="end" class="label">0</text>
  <text x="${padding - 10}" y="${padding}" text-anchor="end" class="label">${maxCount}</text>
  <text x="${padding - 10}" y="${(height - padding + padding) / 2}" text-anchor="end" class="label">${Math.floor(maxCount / 2)}</text>
  
  <!-- Watermark -->
  <text x="${width - padding}" y="${height - 10}" text-anchor="end" class="label" opacity="0.5">Generated on ${new Date().toISOString().split('T')[0]}</text>
</svg>`;

  return svg;
}

/**
 * Main function to run the script
 */
async function main() {
  try {
    console.log(`Fetching PRs for GitHub user: ${config.githubUsername}...`);
    const prs = await fetchUserPRs(config.githubUsername);
    console.log(`Found ${prs.length} PRs`);
    
    const monthlyData = organizePRData(prs);
    console.log('Organized PR data by month');
    
    const svgContent = generateSVGGraph(monthlyData);
    fs.writeFileSync(config.outputPath, svgContent, 'utf8');
    console.log(`PR contribution graph saved to: ${config.outputPath}`);
    
    // Also save data as JSON for potential future use
    fs.writeFileSync(
      path.join(__dirname, 'pr-contribution-data.json'), 
      JSON.stringify(monthlyData, null, 2), 
      'utf8'
    );
    console.log('PR contribution data saved as JSON');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();