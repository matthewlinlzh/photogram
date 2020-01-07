# Viewgram

<p>this is the basic mock instagram writen by react native with Firebase backend.</p>

<p>including three pages:</p>

<h2>1.Feed Page</h2>
  <ul>
    <li>This page is for user that they can see all the photos which different users are uploaded </li>
    <li>users are allow to scroll up top to refresh to check for any new update</li>
    <li>all users are able to check for all user in the database</li>
    <li>user can also see the time which the photo was update, and which author update it</li>
    <li>user can also click the user on the right hand side to access to the author main page</li>
    <li>all photo will have a comment button that they can be access to view the existing comments</li>
  </ul>
  
<h2>2.Upload page</h2>
  <table>
    <tr>
      <th>Not Login</th>
      <th>Login</th>
    </tr>
    <tr>
      <th>
        <ul>
          <li>if the user are not on the login status, this page will not be accessable for those user</li>
          <li>user can have the option to login or register as a new user in order to process the upload option</li>
        </ul>
      </th>
      <th>
        <ul>
          <li>user will see an upload button and be able to click to view the upload screen</li>
          <li>when pressing the upload button, user are able to ahead to choice image from ablum and upload it</li>
          <li>
             upload page
             <ul>
              <li>Inside the upload page, the user will need to make a caption for the photo</li>
              <li>user is able to see the uploaded photo in the screen</li>
              <li>when user press upload, user will see the progress on the screen and when it was done, user are able to return to the upload screen</li>
             </ul>
          </li>
        </ul>
      </th>
    </tr>
  </table>

<h2>3.Profile page</h2>
  <table>
    <tr>
      <th>Not Login</th>
      <th>Login</th>
    </tr>
    <tr>
      <th>
        <ul>
          <li>if the user are not on the login status, this page will not be accessable for those user</li>
          <li>user can have the option to login or register as a new user in order to go to their own Profile pages</li>
        </ul>
      </th>
      <th>
        <ul>
          <li>user will see their own avatar with a username and name aside</li>
          <li style="text-align:left">there are three button which follows: 
            <ul>
              <li>Log out button</li>
              <li>Edit profile allow user to edit their own profile</li>
              <li>navigate to the upload page to upload a new photo</li>
            </ul>
          </li>
          <li>user are able to see the image that they have already post</li>
        </ul>
      </th>
    </tr>
  </table>
