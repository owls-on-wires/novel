{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    nodePackages.npm
    nodePackages.typescript
  ];

  shellHook = ''
    echo "Novel Library Development Environment"
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "TypeScript version: $(tsc --version)"
    echo ""
    echo "Available commands:"
    echo "  npm install     - Install dependencies"
    echo "  npm run build   - Build the library"
    echo "  npm run dev     - Build in watch mode"
    echo "  npm test        - Run tests"
    echo ""
    echo "Example project:"
    echo "  cd examples/basic && npm install && npm start"
    echo ""
    echo "Note: Rollup will be available via npm after running 'npm install'"
  '';
}
