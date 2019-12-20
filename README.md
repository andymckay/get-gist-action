This Action gets a Gist off of GitHub and writes it out to a file. It requires that the gist only contains one and only one file. It authenticates with a PAT to get private Gists.

### Inputs:
* `gistURL`: The URL to the Gist.

### Outputs:
* `file`: The file the Gist has been written too.

### Example:

This gets a private Gist and outputs the contents of the Gist from the file

```
name: CI
on: [repository_dispatch]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Get Gist
      id: get
      uses: andymckay/get-gist-action@master
      with:
        token: ${{secrets.PAT}}
        gistURL: "https://gist.github.com/andymckay/c290f9c904502e98da98e59124610b93" 
    - name: Show Gist contents
      id: run
      run: |
        cat ${{ steps.get.outputs.file }}
```
