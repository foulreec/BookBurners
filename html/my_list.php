<?php
session_start();
$logged_in = isset($_SESSION['user_id']);

if (!$logged_in) {
    header('Location: login.html');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Reading List - BookBurners</title>
    <link rel="stylesheet" href="../css/styles.css" />
    <link rel="stylesheet" href="../css/books.css" />
</head>
<body>
    <header>
        <nav>
            <h1>BookBurners</h1>
            <ul>
                <li><a href="../index.php">Home</a></li>
                <li><a href="books.php">Books</a></li>
                <li><a href="../php/logout.php">Logout</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="my-reading-list">
            <h2>My Reading List</h2>
            <p id="list-description">Books you've saved to read later</p>
            <div id="reading-list-container">
                <p id="loading">Loading your reading list...</p>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 BookBurners</p>
    </footer>

    <script>
        /**
         * Reading List Manager
         * 
         * Fetches the user's saved reading list from the database and dynamically renders
         * each book as a card with thumbnail, title, authors, and date added.
         * 
         * Features:
         * - Displays all books saved by the logged-in user
         * - Shows empty state with link to Books page if no books are saved
            * - Allows removal of books from the reading list
         * API Endpoint: ../php/api/reading_list.php (GET, DELETE)
         */
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.getElementById('reading-list-container');
            
            fetch('../php/api/reading_list.php')
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch reading list');
                    return res.json();
                })
                .then(books => {
                    if (books.error) {
                        container.innerHTML = '<p class="error">Error: ' + books.error + '</p>';
                        return;
                    }
                    
                    if (!books || books.length === 0) {
                        container.innerHTML = '<p id="empty-list">Your reading list is empty. Visit the <a href="books.php">Books page</a> to add books!</p>';
                        return;
                    }
                    
                    container.innerHTML = '';
                    const grid = document.createElement('div');
                    grid.className = 'books-grid';
                    
                    books.forEach(book => {
                        const card = document.createElement('div');
                        card.className = 'book-card';
                        
                        const img = document.createElement('img');
                        img.src = book.thumbnail || '../images/no-cover.png';
                        img.alt = book.title;
                        img.onerror = () => { img.src = '../images/no-cover.png'; };
                        card.appendChild(img);
                        
                        const title = document.createElement('h3');
                        title.textContent = book.title;
                        card.appendChild(title);
                        
                        if (book.authors) {
                            const authors = document.createElement('p');
                            authors.className = 'book-authors';
                            authors.textContent = book.authors;
                            card.appendChild(authors);
                        }
                        
                        const addedDate = document.createElement('p');
                        addedDate.className = 'added-date';
                        addedDate.textContent = 'Added: ' + new Date(book.added_at).toLocaleDateString();
                        card.appendChild(addedDate);
                        
                        const buttonContainer = document.createElement('div');
                        buttonContainer.className = 'book-actions';
                        
                        const viewBtn = document.createElement('button');
                        viewBtn.textContent = 'View Details';
                        viewBtn.className = 'view-btn';
                        viewBtn.onclick = () => {
                            window.location.href = 'book.php?id=' + book.volume_id;
                        };
                        buttonContainer.appendChild(viewBtn);
                        
                        const removeBtn = document.createElement('button');
                        removeBtn.textContent = 'Remove';
                        removeBtn.className = 'remove-btn';
                        removeBtn.onclick = () => {
                            if (confirm('Remove "' + book.title + '" from your list?')) {
                                fetch('../php/api/reading_list.php', {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ volumeId: book.volume_id })
                                })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.success) {
                                        card.remove();
                                        if (grid.children.length === 0) {
                                            container.innerHTML = '<p id="empty-list">Your reading list is empty. Visit the <a href="books.php">Books page</a> to add books!</p>';
                                        }
                                    } else {
                                        alert('Failed to remove book');
                                    }
                                })
                                .catch(err => {
                                    console.error('Error removing book:', err);
                                    alert('Failed to remove book');
                                });
                            }
                        };
                        buttonContainer.appendChild(removeBtn);
                        
                        card.appendChild(buttonContainer);
                        grid.appendChild(card);
                    });
                    
                    container.appendChild(grid);
                })
                .catch(err => {
                    console.error('Error:', err);
                    container.innerHTML = '<p class="error">Failed to load your reading list. Please try again later.</p>';
                });
        });
    </script>

    <style>
        #my-reading-list {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        
        #my-reading-list h2 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        #list-description {
            color: #666;
            margin-bottom: 2rem;
        }
        
        #loading, #empty-list, .error {
            text-align: center;
            padding: 2rem;
            font-size: 1.1rem;
        }
        
        #empty-list a {
            color: #e74c3c;
            text-decoration: underline;
        }
        
        .error {
            color: #e74c3c;
        }
        
        .books-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 2rem;
            padding: 1rem 0;
        }
        
        .book-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .book-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        
        .book-card img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        
        .book-card h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            min-height: 2.5rem;
            line-height: 1.3;
        }
        
        .book-authors {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .added-date {
            color: #999;
            font-size: 0.85rem;
            margin-bottom: 1rem;
        }
        
        .book-actions {
            display: flex;
            gap: 0.5rem;
            flex-direction: column;
        }
        
        .view-btn, .remove-btn {
            padding: 0.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.2s;
        }
        
        .view-btn {
            background: #333;
            color: white;
        }
        
        .view-btn:hover {
            background: #555;
        }
        
        .remove-btn {
            background: #e74c3c;
            color: white;
        }
        
        .remove-btn:hover {
            background: #c0392b;
        }
        
        @media (max-width: 768px) {
            .books-grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
            }
        }
    </style>
</body>
</html>
