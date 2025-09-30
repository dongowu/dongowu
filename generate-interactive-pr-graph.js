/**
 * Interactive PR Contribution Graph Generator
 * 
 * This script fetches PR data from GitHub and generates an interactive HTML contribution graph
 * showing PR activity over time with detailed repository information.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  githubUsername: 'dongowu', // Your GitHub username
  outputPath: path.join(__dirname, 'pr-contribution-graph.html'),
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
      repositories: {},
      prs: []
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
      
      // Store PR details
      monthlyData[monthKey].prs.push({
        title: pr.title,
        url: pr.html_url,
        repo: repoName,
        created_at: pr.created_at,
        state: pr.state
      });
    }
  });
  
  return monthlyData;
}

/**
 * Generates interactive HTML graph from PR data
 * @param {Object} monthlyData - Organized PR data
 * @returns {string} - HTML content
 */
function generateHTMLGraph(monthlyData) {
  // Convert data for Chart.js
  const months = Object.keys(monthlyData);
  const prCounts = months.map(month => monthlyData[month].count);
  
  // Get top repositories across all months
  const allRepos = {};
  Object.values(monthlyData).forEach(monthData => {
    Object.entries(monthData.repositories).forEach(([repo, count]) => {
      if (!allRepos[repo]) {
        allRepos[repo] = count;
      } else {
        allRepos[repo] += count;
      }
    });
  });
  
  // Sort repositories by PR count
  const topRepos = Object.entries(allRepos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([repo]) => repo);
  
  // Generate repo data series for Chart.js
  const repoSeries = topRepos.map(repo => {
    return {
      repo,
      data: months.map(month => {
        return monthlyData[month].repositories[repo] || 0;
      })
    };
  });
  
  // Format month labels for display
  const monthLabels = months.map(monthKey => {
    const [year, month] = monthKey.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  });
  
  // Generate HTML with embedded Chart.js
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PR Contribution Graph for ${config.githubUsername}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f6f8fa;
      color: #24292e;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      padding: 20px;
    }
    h1, h2 {
      text-align: center;
      margin-bottom: 20px;
    }
    .chart-container {
      position: relative;
      height: 400px;
      margin-bottom: 30px;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin-bottom: 30px;
    }
    .stat-card {
      background-color: #f6f8fa;
      border-radius: 6px;
      padding: 15px;
      margin: 10px;
      min-width: 200px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #0366d6;
    }
    .repo-list {
      margin-top: 10px;
    }
    .repo-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      padding: 5px 0;
      border-bottom: 1px solid #eaecef;
    }
    .pr-list {
      margin-top: 20px;
      border-top: 1px solid #eaecef;
      padding-top: 20px;
    }
    .month-selector {
      margin-bottom: 15px;
      text-align: center;
    }
    .pr-item {
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 6px;
      background-color: #f6f8fa;
    }
    .pr-item:hover {
      background-color: #f0f4f8;
    }
    .pr-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .pr-meta {
      font-size: 12px;
      color: #586069;
    }
    .pr-link {
      color: #0366d6;
      text-decoration: none;
    }
    .pr-link:hover {
      text-decoration: underline;
    }
    .open {
      color: #28a745;
    }
    .closed {
      color: #d73a49;
    }
    .merged {
      color: #6f42c1;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #586069;
    }
    select {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #e1e4e8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>PR Contribution Graph</h1>
    <p style="text-align: center;">GitHub user: <strong>${config.githubUsername}</strong> | Last ${config.months} months</p>
    
    <div class="stats">
      <div class="stat-card">
        <h3>Total PRs</h3>
        <div class="stat-value">${Object.values(monthlyData).reduce((sum, month) => sum + month.count, 0)}</div>
      </div>
      <div class="stat-card">
        <h3>Active Repositories</h3>
        <div class="stat-value">${Object.keys(allRepos).length}</div>
      </div>
      <div class="stat-card">
        <h3>Most Active Month</h3>
        <div class="stat-value">
          ${(() => {
            const mostActiveMonth = Object.entries(monthlyData)
              .sort((a, b) => b[1].count - a[1].count)[0];
            const [year, month] = mostActiveMonth[0].split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${monthNames[parseInt(month) - 1]} ${year} (${mostActiveMonth[1].count})`;
          })()}
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <canvas id="prChart"></canvas>
    </div>
    
    <h2>Top Repositories</h2>
    <div class="repo-list">
      ${topRepos.map(repo => {
        const totalPRs = allRepos[repo];
        return `
          <div class="repo-item">
            <span>${repo}</span>
            <span>${totalPRs} PR${totalPRs > 1 ? 's' : ''}</span>
          </div>
        `;
      }).join('')}
    </div>
    
    <div class="pr-list">
      <h2>PR Details by Month</h2>
      <div class="month-selector">
        <label for="month-select">Select Month: </label>
        <select id="month-select">
          ${months.map((month, index) => {
            const [year, monthNum] = month.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `<option value="${month}">${monthNames[parseInt(monthNum) - 1]} ${year} (${monthlyData[month].count} PRs)</option>`;
          }).join('')}
        </select>
      </div>
      
      ${months.map(month => {
        return `
          <div id="pr-list-${month}" class="month-prs" style="display: none;">
            ${monthlyData[month].prs.length > 0 ? 
              monthlyData[month].prs.map(pr => {
                return `
                  <div class="pr-item">
                    <div class="pr-title">
                      <a href="${pr.url}" class="pr-link" target="_blank">${pr.title}</a>
                    </div>
                    <div class="pr-meta">
                      Repository: <strong>${pr.repo}</strong> | 
                      Created: ${new Date(pr.created_at).toLocaleDateString()} | 
                      Status: <span class="${pr.state}">${pr.state}</span>
                    </div>
                  </div>
                `;
              }).join('') : 
              '<p>No PRs in this month</p>'
            }
          </div>
        `;
      }).join('')}
    </div>
    
    <div class="footer">
      Generated on ${new Date().toLocaleDateString()} | Data from GitHub API
    </div>
  </div>
  
  <script>
    // Chart.js configuration
    const ctx = document.getElementById('prChart').getContext('2d');
    const prChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(monthLabels)},
        datasets: [
          {
            label: 'Total PRs',
            data: ${JSON.stringify(prCounts)},
            backgroundColor: 'rgba(130, 80, 223, 0.7)',
            borderColor: 'rgba(130, 80, 223, 1)',
            borderWidth: 1
          },
          ${repoSeries.map((series, index) => {
            const colors = [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)'
            ];
            return `{
              label: '${series.repo}',
              data: ${JSON.stringify(series.data)},
              backgroundColor: '${colors[index % colors.length]}',
              borderColor: '${colors[index % colors.length].replace('0.5', '1')}',
              borderWidth: 1
            }`;
          }).join(',')}
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of PRs'
            },
            ticks: {
              stepSize: 1
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'PR Contributions Over Time'
          }
        }
      }
    });
    
    // Month selector functionality
    const monthSelect = document.getElementById('month-select');
    const monthPrLists = document.querySelectorAll('.month-prs');
    
    function showSelectedMonth() {
      const selectedMonth = monthSelect.value;
      
      monthPrLists.forEach(list => {
        list.style.display = 'none';
      });
      
      const selectedList = document.getElementById('pr-list-' + selectedMonth);
      if (selectedList) {
        selectedList.style.display = 'block';
      }
    }
    
    monthSelect.addEventListener('change', showSelectedMonth);
    
    // Show the first month by default
    if (monthSelect.options.length > 0) {
      showSelectedMonth();
    }
  </script>
</body>
</html>`;

  return html;
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
    
    const htmlContent = generateHTMLGraph(monthlyData);
    fs.writeFileSync(config.outputPath, htmlContent, 'utf8');
    console.log(`Interactive PR contribution graph saved to: ${config.outputPath}`);
    
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