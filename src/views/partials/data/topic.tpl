<div class="post" data-index="{posts.index}" data-pid="{posts.pid}" data-uid="{posts.uid}" data-timestamp="{posts.timestamp}"
    data-username="{{{ if posts.anonymous }}}Anonymous{{{ else }}}{posts.user.username}{{{ end }}}"
    data-userslug="{{{ if posts.anonymous }}}anonymous-user{{{ else }}}{posts.user.userslug}{{{ end }}}"
    {{{ if posts.allowDupe }}} data-allow-dupe="1"{{{ end }}}
    {{{ if posts.navigatorIgnore }}} data-navigator-ignore="1"{{{ end }}}
    itemprop="comment" itemtype="http://schema.org/Comment" itemscope>

    <!-- Display user information based on anonymity -->
    <div class="post-author">
        {{{ if posts.anonymous }}}
            <span>Anonymous</span>
        {{{ else }}}
            <a href="{config.relative_path}/user/{posts.user.userslug}">
                {posts.user.username}
            </a>
        {{{ end }}}
    </div>
</div>