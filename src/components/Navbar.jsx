function Navbar() {
    return (
        <nav className="navbar bg-blue-600 p-4 text-white">
            <ul className="flex space-x-4">
                <li><a href="/" className="hover:underline">Home</a></li>
                <li><a href="/about" className="hover:underline">About</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
        </nav>
    );
}
export default Navbar;
