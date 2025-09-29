/**
 * GitHub PR Fetcher for Rust Projects
 * 
 * This script fetches PRs from a GitHub user and updates the README.md file
 * with information about Rust-related contributions.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  githubUsername: 'dongowu', // Your GitHub username
  readmePath: path.join(__dirname, 'README.md'),
  maxPRsToShow: 5, // Maximum number of PRs to display
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
      path: `/search/issues?q=author:${username}+type:pr+is:public`,
      method: 'GET',
      headers: {
        'User-Agent': 'PR-Fetcher-Script',
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
 * Filters PRs to find Rust-related contributions
 * @param {Array} prs - Array of PR objects
 * @returns {Array} - Filtered array of Rust-related PRs
 */
function filterRustPRs(prs) {
  return prs.filter(pr => {
    // Check if PR is related to Rust based on repository name or labels
    const isRustRepo = pr.repository_url && 
      (pr.repository_url.toLowerCase().includes('rust') || 
       pr.repository_url.toLowerCase().includes('cargo'));
    
    // Check labels if available
    const hasRustLabel = pr.labels && 
      pr.labels.some(label => 
        label.name.toLowerCase().includes('rust') || 
        label.name.toLowerCase().includes('cargo'));
    
    // Check title and body for Rust mentions
    const titleHasRust = pr.title.toLowerCase().includes('rust');
    const bodyHasRust = pr.body && pr.body.toLowerCase().includes('rust');
    
    return isRustRepo || hasRustLabel || titleHasRust || bodyHasRust;
  });
}

/**
 * Formats PR data for README display
 * @param {Array} rustPRs - Array of Rust-related PRs
 * @returns {string} - Formatted markdown content
 */
function formatPRsForReadme(rustPRs) {
  if (rustPRs.length === 0) {
    return '### Open Source Contributions\n- No Rust-related PRs found yet.\n';
  }

  const prItems = rustPRs
    .slice(0, config.maxPRsToShow)
    .map(pr => {
      const repoName = pr.repository_url.replace('https://api.github.com/repos/', '');
      return `- **[${repoName}](${pr.html_url})**: ${pr.title}`;
    })
    .join('\n');

  return `### Open Source Contributions\n${prItems}\n`;
}

/**
 * Updates the README.md file with PR information
 * @param {string} contributionsSection - Formatted markdown content
 */
function updateReadme(contributionsSection) {
  try {
    let readmeContent = fs.readFileSync(config.readmePath, 'utf8');
    
    // Define the section to replace
    const sectionRegex = /(### Open Source Contributions\n)[\s\S]*?(\n## |$)/;
    
    if (sectionRegex.test(readmeContent)) {
      // Replace existing section
      readmeContent = readmeContent.replace(
        sectionRegex, 
        `$1${contributionsSection.replace('### Open Source Contributions\n', '')}$2`
      );
    } else {
      // Add new section before "Other Featured Projects"
      const otherProjectsRegex = /(## 🏆 Other Featured Projects)/;
      if (otherProjectsRegex.test(readmeContent)) {
        readmeContent = readmeContent.replace(
          otherProjectsRegex, 
          `${contributionsSection}\n$1`
        );
      } else {
        console.error('Could not find a suitable location to insert the contributions section');
        return;
      }
    }
    
    fs.writeFileSync(config.readmePath, readmeContent, 'utf8');
    console.log('README.md updated successfully with Rust PR information!');
  } catch (error) {
    console.error(`Failed to update README: ${error.message}`);
  }
}

/**
 * Main function to run the script
 */
async function main() {
  try {
    console.log(`Fetching PRs for GitHub user: ${config.githubUsername}...`);
    const prs = await fetchUserPRs(config.githubUsername);
    console.log(`Found ${prs.length} total PRs`);
    
    const rustPRs = filterRustPRs(prs);
    console.log(`Found ${rustPRs.length} Rust-related PRs`);
    
    const contributionsSection = formatPRsForReadme(rustPRs);
    updateReadme(contributionsSection);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();