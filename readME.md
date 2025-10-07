<%= %>    Outputs escaped content     <%= title %>
<%- %>    Outputs unescaped HTML (useful for partials)      <%- include ("partials/header") %>
<% %>     Runs JS logic without output      <% students.forEach(...)%>